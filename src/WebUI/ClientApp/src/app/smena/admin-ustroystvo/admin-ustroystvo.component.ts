import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DeviceDto, DevicesClient,UpdateDeviceCommand, CreateDeviceCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-ustroystvo',
  templateUrl: './admin-ustroystvo.component.html',
  styleUrls: ['./admin-ustroystvo.component.css']
})
export class AdminUstroystvoComponent implements OnInit {
  debug = false;

  dataSource: DeviceDto[] = [];
  columnList: string[] = ['id', 'code', 'name', 'zone', 'latitude', 'longitude', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  updateForm: FormGroup;
  createForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', errors: null };

  constructor(private devicesClient: DevicesClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      zone: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
      latitude: new FormControl('', [Validators.maxLength(16)]),
      longitude: new FormControl('', [Validators.maxLength(16)]),
      id: new FormControl('', [Validators.required]),
    });
    this.createForm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      zone: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
      latitude: new FormControl('', [Validators.maxLength(16)]),
      longitude: new FormControl('', [Validators.maxLength(16)]),
    });
  }

  refresh() {
    this.devicesClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => console.error(error)
    );
  }

  openUpdateModal(entity: DeviceDto, template: TemplateRef<any>) {
    this.updateForm.patchValue(entity);
    this.updateForm.get('id').disable();
    this.modalEditor.title = 'Update Device: ' + entity.code;
    this.modalRef = this.modalService.show(template);
  }

  updateEntity() {
    const updateEntityCommand = UpdateDeviceCommand.fromJS(this.updateForm.getRawValue());

    this.devicesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const index = this.dataSource.findIndex(x => x.id === updateEntityCommand.id);
          const updatedEntity = this.createEntityFromForm(this.updateForm);
          this.dataSource.splice(index, 1, updatedEntity);
          this.table.renderRows();
          this.closeModal(this.updateForm);
        },
        error => {
          this.addErrorsToModal(error);
        }
    );
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalEditor.title = 'Create New Device';
    this.modalRef = this.modalService.show(template);
  }

  saveEntity() {
    const newEntityCommand = CreateDeviceCommand.fromJS(this.createForm.getRawValue());

    this.devicesClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.createEntityFromForm(this.createForm);
            entity.id = result;
            this.dataSource.push(entity);
            this.table.renderRows();
            this.closeModal(this.createForm);
          } else {
            this.modalEditor.errors.push('An error occured while saving the new Device.');
          }
        },
        error => {
          this.addErrorsToModal(error);
        }
    );
  }

  private createEntityFromForm(form: FormGroup): DeviceDto {
    const entity = DeviceDto.fromJS(form.getRawValue());
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
    if (confirm('All Device data will be lost (Device, cards, taps)! Are you sure to delete Device?' + id)) {
      console.log('Change efcore to set id to null in cards');
      // this.devicesClient.delete(id).subscribe(
      //   result => {
      //     // do something with no return
      //     const index = this.dataSource.findIndex(x => x.id === id);
      //     this.dataSource.splice(index, 1);
      //     this.table.renderRows();
      //   },
      //   error => console.error(error)
      // );
    }
  }
}
