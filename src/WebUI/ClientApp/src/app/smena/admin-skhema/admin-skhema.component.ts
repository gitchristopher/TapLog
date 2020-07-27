import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StageDto, StagesClient, IUpdateStageCommand, UpdateStageCommand, CreateStageCommand, SupplierDto, SuppliersClient, UpdateSupplierCommand, CreateSupplierCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-skhema',
  templateUrl: './admin-skhema.component.html',
  styleUrls: ['./admin-skhema.component.css']
})
export class AdminSkhemaComponent implements OnInit {
  dataSource: SupplierDto[] = [];
  columnList: string[] = ['id', 'name', 'edit', 'delete'];

  updateModalRef: BsModalRef;
  selectedEntity = new SupplierDto();
  createModalRef: BsModalRef;
  newEntity = new SupplierDto();
  modalEditor: IModal = {title: 'Editor', errors: null };

  ufg: FormGroup;
  cfg: FormGroup;
  debug = false;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private suppliersClient: SuppliersClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.ufg = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      id: new FormControl('', [Validators.required]),
    });
    this.cfg = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
    });
  }

  refresh() {
    this.suppliersClient.getAll().subscribe(
      result => {
        this.dataSource = result; console.log(result);
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
    const updatedEntity = UpdateSupplierCommand.fromJS(this.selectedEntity);

    this.suppliersClient.update(updatedEntity.id, updatedEntity).subscribe(
        result => {
          // this.refresh();
          const index = this.dataSource.findIndex(x => x.id === this.selectedEntity.id);
          this.dataSource.splice(index, 1, this.selectedEntity);
          this.table.renderRows();
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
    const entity = CreateSupplierCommand.fromJS(this.newEntity);

    this.suppliersClient.create(entity).subscribe(
        result => {
          if (result > 0) {
            const index = this.dataSource.findIndex(x => x.id === this.selectedEntity.id);
            this.newEntity.id = result;
            this.dataSource.push(SupplierDto.fromJS(this.newEntity));
            this.table.renderRows();
          }
          this.modalEditor.errors = null;
          this.createModalRef.hide();
        },
        error => {
            const errors = JSON.parse(error.response);
            console.error('Error while creating a supplier.');
            if (errors && errors.Title) {
                this.modalEditor.errors.push(errors.Title[0]);
            }
            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }

  openUpdateModal(entity: SupplierDto, template: TemplateRef<any>) {
    this.selectedEntity = SupplierDto.fromJS(this.dataSource.find(x => x.id === entity.id));
    this.modalEditor.title = 'Update Supplier: ' + this.selectedEntity.name;
    this.ufg.get('name').setValue(this.selectedEntity.name);
    this.ufg.get('id').setValue(this.selectedEntity.id);
    this.ufg.get('id').disable();
    this.updateModalRef = this.modalService.show(template);
  }
  openCreateModal(template: TemplateRef<any>) {
    this.newEntity = new SupplierDto();
    this.modalEditor.title = 'Create New Supplier';
    this.cfg.get('name').setValue('');
    this.createModalRef = this.modalService.show(template);
  }

  deleteEntity(id: number) {
    if (confirm('All supplier data will be lost (Supplier, cards, taps)! Are you sure to delete supplier?' + id)) {
      this.suppliersClient.delete(id).subscribe(
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
