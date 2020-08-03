import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DeviceDto, DevicesClient,UpdateDeviceCommand, CreateDeviceCommand, DeviceToDeleteDto, AdminClient } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-ustroystvo',
  templateUrl: './admin-ustroystvo.component.html',
  styleUrls: ['./admin-ustroystvo.component.css']
})
export class AdminUstroystvoComponent implements OnInit {
  debug = false;
  entityToDeleteStats: DeviceToDeleteDto;
  dataSource: DeviceDto[] = [];
  columnList: string[] = ['id', 'code', 'name', 'zone', 'latitude', 'longitude', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  entityForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', button: 'Submit', errors: null };

  constructor(private devicesClient: DevicesClient, private adminClient: AdminClient,
    private modalService: BsModalService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.entityForm = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(64)]),
      zone: new FormControl(null, [Validators.required]),
      latitude: new FormControl('', [Validators.maxLength(16)]),
      longitude: new FormControl('', [Validators.maxLength(16)]),
      id: new FormControl('', [Validators.required]),
    });

    this.refresh();
  }

  refresh() {
    this.devicesClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openModal(entity: DeviceDto, template: TemplateRef<any>) {
    if (entity === null) {
      this.modalEditor.title = 'Create New Device';
      this.modalEditor.button = 'Save';
    } else {
      this.modalEditor.title = 'Update Device: ' + entity.name;
      this.modalEditor.button = 'Update';
      this.entityForm.patchValue(entity);
    }
    this.entityForm.get('id').disable();
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.entityForm.reset();
    this.modalRef.hide();
    this.modalEditor.errors = null;
  }

  submit() {
    const form = this.entityForm.getRawValue();
    if (!form['id']) {
      this.createEntity();
    } else {
      this.updateEntity();
    }
  }

  createEntity() {
    const newEntityCommand = CreateDeviceCommand.fromJS(this.entityForm.getRawValue());
    newEntityCommand.code = newEntityCommand.code.trim();
    newEntityCommand.name = newEntityCommand.name.trim();
    newEntityCommand.latitude = newEntityCommand.latitude?.trim();
    newEntityCommand.longitude = newEntityCommand.longitude?.trim();

    this.devicesClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.makeEntityFromForm(result, this.entityForm);
            this.updateTable(entity);
            this.closeModal();
            this.openSnackBar(`Added successfully: ${entity.name}`, null);
          } else {
            this.openSnackBar('An error occured while saving the new Device.', null);
          }
        },
        error => {
          this.addErrorFromApi(error);
          this.openSnackBar(error.title, null);
        }
    );
  }

  updateEntity() {
    const updateEntityCommand = UpdateDeviceCommand.fromJS(this.entityForm.getRawValue());
    updateEntityCommand.code = updateEntityCommand.code.trim();
    updateEntityCommand.name = updateEntityCommand.name.trim();
    updateEntityCommand.latitude = updateEntityCommand.latitude?.trim();
    updateEntityCommand.longitude = updateEntityCommand.longitude?.trim();

    this.devicesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const entity = this.makeEntityFromForm(null, this.entityForm);
          this.updateTable(entity);
          this.closeModal();
          this.openSnackBar(`Updated successfully: ${entity.name}`, null);
        },
        error => {
          this.addErrorFromApi(error);
          this.openSnackBar(error.title, null);
        }
    );
  }

  private makeEntityFromForm(id: number, form: FormGroup): DeviceDto {
    const entity = DeviceDto.fromJS(form.getRawValue());
    if (id !== null) {
      entity.id = id;
    }
    return entity;
  }

  private updateTable(entity: DeviceDto) {
    const index = this.dataSource.findIndex(x => x.id === entity.id);
    if (index < 0) {
      this.dataSource.push(entity);
    } else {
      this.dataSource.splice(index, 1, entity);
    }
    this.table.renderRows();
  }

  openDeleteModal(entity: DeviceDto, template: TemplateRef<any> ) {
    this.modalEditor.title = 'Delete Device: ' + entity.code + ' - ' + entity.name;
    this.modalEditor.button = 'Delete';

    this.adminClient.getDeviceDelete(entity.id).subscribe(
      result => {
        this.entityToDeleteStats = result;
        this.entityForm.get('id').setValue(this.entityToDeleteStats.id);
        this.modalRef = this.modalService.show(template);
      },
      error => {
        this.addErrorFromApi(error);
        this.openSnackBar(error.title, null);
      }
    );
  }

  deleteEntity() {
    const entityToDelete = this.dataSource.find(x => x.id === Number(this.entityForm.getRawValue()['id']));
    const userInput = String(this.entityForm.getRawValue()['code']);
    const entityParameter = entityToDelete.code.trim();

    if (userInput === entityParameter) {
      if (confirm('Are you really really sure?')) {
        this.devicesClient.delete(entityToDelete.id).subscribe(
          result => {
            // do something with no return
            const index = this.dataSource.findIndex(x => x.id === entityToDelete.id);
            this.dataSource.splice(index, 1);
            this.table.renderRows();
            this.closeModal();
            this.openSnackBar('Deleted successfully', null);
          },
          error => {
            this.addErrorFromApi(error);
            this.openSnackBar(error.title, null);
          }
        );
      }
    } else {
      this.entityForm.get('code').setErrors({ mismatch: true });
    }
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  addErrorFromApi(error: any) {
    this.modalEditor.errors = [];
    const response = JSON.parse(error['response']);
    const errorArray = Object.values(response['errors']);
    errorArray.forEach(element => {
      this.modalEditor.errors.push(element[0]);
    });
  }
}
