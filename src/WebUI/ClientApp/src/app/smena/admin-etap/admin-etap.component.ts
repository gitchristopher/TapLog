import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StageDto, StagesClient, IUpdateStageCommand, UpdateStageCommand, CreateStageCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-etap',
  templateUrl: './admin-etap.component.html',
  styleUrls: ['./admin-etap.component.css']
})
export class AdminEtapComponent implements OnInit {
  // stage: string[] = ['id', 'name', 'isCurrent'];
  dataSource: StageDto[] = [];
  columnList: string[] = ['id', 'name', 'isCurrent', 'edit', 'delete'];

  updateModalRef: BsModalRef;
  selectedEntity = new StageDto();
  createModalRef: BsModalRef;
  newEntity = new StageDto();
  modalEditor: IModal = {title: 'Editor', errors: null };

  ufg: FormGroup;
  cfg: FormGroup;
  debug = false;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private stagesClient: StagesClient, private modalService: BsModalService) { }

  ngOnInit() {
    // this.refresh();
    this.ufg = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      isCurrent: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
    });
    this.cfg = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      isCurrent: new FormControl('', [Validators.required]),
    });
  }

  refresh() {
    this.stagesClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => console.error(error)
    );
  }

  updateCancelled() {
    this.updateModalRef.hide();
    this.modalEditor.errors = null;
  }
  createCancelled() {
    this.createModalRef.hide();
    this.modalEditor.errors = null;
  }

  updateEntity() {
    this.selectedEntity.name = this.ufg.value.name;
    this.selectedEntity.isCurrent = this.ufg.value.isCurrent;
    const updatedEntity = UpdateStageCommand.fromJS(this.selectedEntity);

    this.stagesClient.update(updatedEntity.id, updatedEntity).subscribe(
        result => {
          this.refresh();
          // const index = this.dataSource.findIndex(x => x.id === this.selectedEntity.id);
          // this.dataSource.splice(index, 1, this.selectedEntity);
          // this.table.renderRows();
          this.modalEditor.errors = null;
          this.updateModalRef.hide();
        },
        error => {
            const errors = JSON.parse(error.response);
            console.error('Error while updating the stage.');
            if (errors && errors.Title) {
                this.modalEditor.errors.push(errors.Title[0]);
            }
            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }
  createEntity() {
    this.newEntity.name = this.cfg.value.name;
    this.newEntity.isCurrent = this.cfg.value.isCurrent;
    const entity = CreateStageCommand.fromJS(this.newEntity);

    this.stagesClient.create(entity).subscribe(
        result => {
          if (result > 0) {
            const index = this.dataSource.findIndex(x => x.id === this.selectedEntity.id);
            this.newEntity.id = result;
            this.dataSource.push(StageDto.fromJS(this.newEntity));
            this.table.renderRows();
          }
          this.modalEditor.errors = null;
          this.createModalRef.hide();
        },
        error => {
            const errors = JSON.parse(error.response);
            console.error('Error while creating a stage.');
            if (errors && errors.Title) {
                this.modalEditor.errors.push(errors.Title[0]);
            }
            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }

  openUpdateModal(entity: StageDto, template: TemplateRef<any>) {
    this.selectedEntity = StageDto.fromJS(this.dataSource.find(x => x.id === entity.id));
    this.modalEditor.title = 'Update Stage: ' + this.selectedEntity.name;
    this.ufg.get('name').setValue(this.selectedEntity.name);
    this.ufg.get('isCurrent').setValue(this.selectedEntity.isCurrent);
    this.ufg.get('id').setValue(this.selectedEntity.id);
    this.ufg.get('id').disable();
    this.updateModalRef = this.modalService.show(template);
  }
  openCreateModal(template: TemplateRef<any>) {
    this.newEntity = new StageDto();
    this.modalEditor.title = 'Create New Stage';
    this.cfg.get('name').setValue('');
    this.cfg.get('isCurrent').setValue(false);
    this.createModalRef = this.modalService.show(template);
  }

  deleteEntity(id: number) {
    if (confirm('All stage data will be lost! Are you sure to delete stage?' + id)) {
      this.stagesClient.delete(id).subscribe(
        result => {
          // do something with no return
          const index = this.dataSource.findIndex(x => x.id === id);
          this.dataSource.splice(index, 1);
          this.table.renderRows();
        },
        error => console.error(error)
      );
    }
  }
}
