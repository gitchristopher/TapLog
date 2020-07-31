import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { StageDto, StagesClient, UpdateStageCommand, CreateStageCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoBadCharacters } from 'src/_validators/noBadCharacters';

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

  entityForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', button: 'Submit', errors: null };

  constructor(private stagesClient: StagesClient, private modalService: BsModalService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.entityForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32), NoBadCharacters]),
      isCurrent: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
    });
  }

  refresh() {
    this.stagesClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openModal(entity: StageDto, template: TemplateRef<any>) {
    if (entity === null) {
      this.modalEditor.title = 'Create New Stage';
      this.modalEditor.button = 'Save';
    } else {
      this.modalEditor.title = 'Update Stage: ' + entity.name;
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
    const newEntityCommand = CreateStageCommand.fromJS(this.entityForm.getRawValue());

    this.stagesClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.makeEntityFromForm(result, this.entityForm);
            this.updateTable(entity);
            this.closeModal();
            this.openSnackBar(`Added successfully: ${entity.name}`, null);
          } else {
            this.openSnackBar('An error occured while saving the new Stage.', null);
          }
        },
        error => {
          this.openSnackBar(error.title, null);
        }
    );
  }

  updateEntity() {
    const updateEntityCommand = UpdateStageCommand.fromJS(this.entityForm.getRawValue());

    this.stagesClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const entity = this.makeEntityFromForm(null, this.entityForm);
          this.refresh();
          this.closeModal();
          this.openSnackBar(`Updated successfully: ${entity.name}`, null);
        },
        error => {
          this.openSnackBar(error.title, null);
        }
    );
  }

  private makeEntityFromForm(id: number, form: FormGroup): StageDto {
    const entity = StageDto.fromJS(form.getRawValue());
    entity.stageTests = [];
    if (id !== null) {
      entity.id = id;
    }
    return entity;
  }

  private updateTable(entity: StageDto) {
    const index = this.dataSource.findIndex(x => x.id === entity.id);
    if (index < 0) {
      this.dataSource.push(entity);
    } else {
      this.dataSource.splice(index, 1, entity);
    }
    this.table.renderRows();
  }

  deleteEntity(id: number) {
    if (confirm('All data connected to this stage will be lost! Are you sure to delete stage?' + id)) {
      this.stagesClient.delete(id).subscribe(
        result => {
          // do something with no return
          const index = this.dataSource.findIndex(x => x.id === id);
          this.dataSource.splice(index, 1);
          this.table.renderRows();
          this.openSnackBar('Deleted successfully', null);
        },
        error => {
          this.openSnackBar(error.title, null);
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
