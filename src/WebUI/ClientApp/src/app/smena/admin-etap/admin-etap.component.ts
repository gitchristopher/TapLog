import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StageDto, StagesClient, UpdateStageCommand, CreateStageCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-etap',
  templateUrl: './admin-etap.component.html',
  styleUrls: ['./admin-etap.component.css']
})
export class AdminEtapComponent implements OnInit {
  debug = false;

  dataSource: StageDto[] = [];
  columnList: string[] = ['id', 'name', 'isCurrent', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  updateForm: FormGroup;
  createForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', errors: null };

  constructor(private stagesClient: StagesClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      isCurrent: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
    });
    this.createForm = new FormGroup({
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

  openUpdateModal(entity: StageDto, template: TemplateRef<any>) {
    this.updateForm.patchValue(entity);
    this.updateForm.get('id').disable();
    this.modalEditor.title = 'Update Stage: ' + entity.name;
    this.modalRef = this.modalService.show(template);
  }

  updateEntity() {
    const updateEntityCommand = UpdateStageCommand.fromJS(this.updateForm.getRawValue());

    this.stagesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          this.refresh();
          this.closeModal(this.updateForm);
        },
        error => {
          this.addErrorsToModal(error);
        }
    );
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalEditor.title = 'Create New Stage';
    this.modalRef = this.modalService.show(template);
  }

  saveEntity() {
    const newEntityCommand = CreateStageCommand.fromJS(this.createForm.getRawValue());

    this.stagesClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.createEntityFromForm(this.createForm);
            entity.id = result;
            this.dataSource.push(entity);
            this.table.renderRows();
            this.closeModal(this.createForm);
          } else {
            this.modalEditor.errors.push('An error occured while saving the new Stage.');
          }
        },
        error => {
          this.addErrorsToModal(error);
        }
    );
  }

  private createEntityFromForm(form: FormGroup): StageDto {
    const entity = StageDto.fromJS(form.getRawValue());
    entity.stageTests = [];
    return entity;
  }

  private addErrorsToModal(error: any) {
    const errors = JSON.parse(error.response);
    if (errors && errors.title) {
      this.modalEditor.errors = [errors];
    }
  }

  closeModal(form: FormGroup) {
    form.reset();
    this.modalRef.hide();
    this.modalEditor.errors = null;
  }

  deleteEntity(id: number) {
    if (confirm('All data connected to this stage will be lost! Are you sure to delete stage?' + id)) {
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
