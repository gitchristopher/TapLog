import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DeviceDto, DevicesClient,UpdateDeviceCommand, CreateDeviceCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-ustroystvo',
  templateUrl: './admin-ustroystvo.component.html',
  styleUrls: ['./admin-ustroystvo.component.css']
})
export class AdminUstroystvoComponent implements OnInit {
  dataSource: DeviceDto[] = [];
  columnList: string[] = ['id', 'code', 'name', 'zone', 'latitude', 'longitude', 'edit', 'delete'];

  updateModalRef: BsModalRef;
  selectedEntity = new DeviceDto();
  createModalRef: BsModalRef;
  newEntity = new DeviceDto();
  modalEditor: IModal = {title: 'Editor', errors: null };

  ufg: FormGroup;
  cfg: FormGroup;
  debug = false;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private devicesClient: DevicesClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.ufg = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      zone: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
      latitude: new FormControl('', [Validators.maxLength(16)]),
      longitude: new FormControl('', [Validators.maxLength(16)]),
      id: new FormControl('', [Validators.required]),
    });
    this.cfg = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      zone: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
      latitude: new FormControl('', [Validators.maxLength(16)]),
      longitude: new FormControl('', [Validators.maxLength(16)]),
    });
  }

  refresh() {
    this.devicesClient.getAll().subscribe(
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
    const updateEntityCommand = this.createUpdatedEntityFromForm();

    this.devicesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
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

  private createUpdatedEntityFromForm() {
    this.selectedEntity.code = this.ufg.value.code;
    this.selectedEntity.name = this.ufg.value.name;
    this.selectedEntity.zone = Number(this.ufg.value.zone);
    this.selectedEntity.latitude = this.ufg.value.latitude ?? '';
    this.selectedEntity.longitude = this.ufg.value.longitude ?? '';
    const updatedEntity = UpdateDeviceCommand.fromJS(this.selectedEntity);
    return updatedEntity;
  }

  saveEntity() {
    const entity = this.createNewEntityFromForm();

    this.devicesClient.create(entity).subscribe(
        result => {
          if (result > 0) {
            this.newEntity.id = result;
            this.dataSource.push(DeviceDto.fromJS(this.newEntity));
            this.table.renderRows();
            this.modalEditor.errors = null;
            this.createModalRef.hide();
          } else {
            this.modalEditor.errors.push('An error occured while saving the new device.');
          }
        },
        error => {
            const errors = JSON.parse(error.response);
            console.error('Error while creating a Device.');
            if (errors && errors.Title) {
                this.modalEditor.errors.push(errors.Title[0]);
            }
            setTimeout(() => document.getElementById('title').focus(), 250);
        }
    );
  }

  private createNewEntityFromForm() {
    this.newEntity = new DeviceDto();
    this.newEntity.code = this.cfg.value.code;
    this.newEntity.name = this.cfg.value.name;
    this.newEntity.zone = Number(this.cfg.value.zone);
    this.newEntity.latitude = this.cfg.value.latitude ?? '';
    this.newEntity.longitude = this.cfg.value.longitude ?? '';
    const entity = CreateDeviceCommand.fromJS(this.newEntity);
    return entity;
  }

  openUpdateModal(entity: DeviceDto, template: TemplateRef<any>) {
    this.setUpdateModalFieldValues(entity);
    this.updateModalRef = this.modalService.show(template);
  }

  private setUpdateModalFieldValues(entity: DeviceDto) {
    const updatedEntity = DeviceDto.fromJS(this.dataSource.find(x => x.id === entity.id));

    this.ufg.get('code').setValue(updatedEntity.code);
    this.ufg.get('name').setValue(updatedEntity.name);
    this.ufg.get('zone').setValue(updatedEntity.zone);
    this.ufg.get('latitude').setValue(updatedEntity.latitude);
    this.ufg.get('longitude').setValue(updatedEntity.longitude);
    this.ufg.get('id').setValue(updatedEntity.id);

    this.ufg.get('id').disable();
    this.modalEditor.title = 'Update Device: ' + updatedEntity.name;
    this.selectedEntity = updatedEntity;
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalEditor.title = 'Create New Device';
    this.createModalRef = this.modalService.show(template);
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
