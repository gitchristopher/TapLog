import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PassDto, PassesClient, UpdatePassCommand, CreatePassCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-bumaga',
  templateUrl: './admin-bumaga.component.html',
  styleUrls: ['./admin-bumaga.component.css']
})
export class AdminBumagaComponent implements OnInit {
  debug = false;

  dataSource: PassDto[] = [];
  columnList: string[] = ['id', 'name', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  updateForm: FormGroup;
  createForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', errors: null };

  constructor(private passesClient: PassesClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      id: new FormControl('', [Validators.required]),
    });
    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
    });
  }

  refresh() {
    this.passesClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => console.error(error)
    );
  }

  openUpdateModal(entity: PassDto, template: TemplateRef<any>) {
    this.updateForm.patchValue(entity);
    this.updateForm.get('id').disable();
    this.modalEditor.title = 'Update Pass: ' + entity.name;
    this.modalRef = this.modalService.show(template);
  }

  updateEntity() {
    const updateEntityCommand = UpdatePassCommand.fromJS(this.updateForm.getRawValue());

    this.passesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
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
    this.modalEditor.title = 'Create New Pass';
    this.modalRef = this.modalService.show(template);
  }

  saveEntity() {
    const newEntityCommand = CreatePassCommand.fromJS(this.createForm.getRawValue());

    this.passesClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.createEntityFromForm(this.createForm);
            entity.id = result;
            this.dataSource.push(entity);
            this.table.renderRows();
            this.closeModal(this.createForm);
          } else {
            this.modalEditor.errors.push('An error occured while saving the new Pass.');
          }
        },
        error => {
          this.addErrorsToModal(error);
        }
    );
  }

  private createEntityFromForm(form: FormGroup): PassDto {
    const entity = PassDto.fromJS(form.getRawValue());
    entity.cards = [];
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
    if (confirm('All Pass data will be lost (Pass, cards, taps)! Are you sure to delete Pass?' + id)) {
      console.log('Change efcore to set id to null in cards');
      // this.passesClient.delete(id).subscribe(
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
