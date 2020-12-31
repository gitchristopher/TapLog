import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassDto, PassesClient, UpdatePassCommand, CreatePassCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-pass',
  templateUrl: './admin-pass.component.html',
  styleUrls: ['./admin-pass.component.css']
})
export class AdminPassComponent implements OnInit {
  debug = false;

  dataSource: PassDto[] = [];
  columnList: string[] = ['id', 'name', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  entityForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', button: 'Submit', errors: null};

  constructor(private passesClient: PassesClient, private modalService: BsModalService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.entityForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      id: new FormControl(null, [Validators.required]),
    });

    this.refresh();
  }

  refresh() {
    this.passesClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openModal(entity: PassDto, template: TemplateRef<any>) {
    if (entity === null) {
      this.modalEditor.title = 'Create New Pass';
      this.modalEditor.button = 'Save';
    } else {
      this.modalEditor.title = 'Update Pass: ' + entity.name;
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
    const newEntityCommand = CreatePassCommand.fromJS(this.entityForm.getRawValue());
    newEntityCommand.name = newEntityCommand.name.trim();

    this.passesClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.makeEntityFromForm(result, this.entityForm);
            this.updateTable(entity);
            this.closeModal();
            this.openSnackBar(`Added successfully: ${entity.name}`, null);
          } else {
            this.openSnackBar('An error occured while saving the new Pass.', null);
          }
        },
        error => {
          this.addErrorFromApi(error);
        }
    );
  }

  updateEntity() {
    const updateEntityCommand = UpdatePassCommand.fromJS(this.entityForm.getRawValue());
    updateEntityCommand.name = updateEntityCommand.name.trim();

    this.passesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const entity = this.makeEntityFromForm(null, this.entityForm);
          this.updateTable(entity);
          this.closeModal();
          this.openSnackBar(`Updated successfully: ${entity.name}`, null);
        },
        error => {
          this.addErrorFromApi(error);
        }
    );
  }

  private makeEntityFromForm(id: number, form: FormGroup): PassDto {
    const entity = PassDto.fromJS(form.getRawValue());
    entity.cards = [];
    if (id !== null) {
      entity.id = id;
    }
    return entity;
  }

  private updateTable(entity: PassDto) {
    const index = this.dataSource.findIndex(x => x.id === entity.id);
    if (index < 0) {
      this.dataSource.push(entity);
    } else {
      this.dataSource.splice(index, 1, entity);
    }
    this.table.renderRows();
  }

  openDeleteModal(entity: PassDto, template: TemplateRef<any> ) {
    this.modalEditor.title = 'Delete Pass: ' + entity.name;
    this.modalEditor.button = 'Delete';
    this.entityForm.get('id').setValue(entity.id);
    this.modalRef = this.modalService.show(template);
  }

  deleteEntity() {
    const entityToDelete = this.dataSource.find(x => x.id === Number(this.entityForm.getRawValue()['id']));
    const userInput = String(this.entityForm.getRawValue()['name']);
    const entityParameter = entityToDelete.name.trim();

    if (userInput === entityParameter) {
      if (confirm('Are you really really sure?')) {
        this.passesClient.delete(entityToDelete.id).subscribe(
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
          }
        );
      }
    } else {
      this.entityForm.get('name').setErrors({mismatch: true});
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
    if (error.title != null || error.title !== undefined) {
      this.openSnackBar(error.title, null);
    } else {
      const errorTitle = response['title'];
      this.openSnackBar(errorTitle, null);
    }
    const errorArray = Object.values(response['errors']);
    errorArray.forEach(element => {
      this.modalEditor.errors.push(element[0]);
    });
  }
}
