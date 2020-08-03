import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CardDto, UpdateCardCommand, CreateCardCommand, CardsClient, SupplierDto,
  ProductDto, PassDto, PassesClient, ProductsClient, SuppliersClient, AdminClient, CardToDeleteDto } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-otkrytka',
  templateUrl: './admin-otkrytka.component.html',
  styleUrls: ['./admin-otkrytka.component.css']
})
export class AdminOtkrytkaComponent implements OnInit {
  debug = false;
  entityToDeleteStats: CardToDeleteDto;
  dataSource: CardDto[] = [];
  columnList: string[] = ['id', 'number', 'alias', 'supplierName', 'productName', 'passName', 'taps', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  supplierList: SupplierDto[] = [];
  productList: ProductDto[] = [];
  passList: PassDto[] = [];

  entityForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', button: 'Submit', errors: null };

  constructor(private cardsClient: CardsClient, private adminClient: AdminClient,
    private modalService: BsModalService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.entityForm = new FormGroup({
      number: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      alias: new FormControl('', [Validators.maxLength(32)]),
      supplierId: new FormControl(null, [Validators.required]),
      productId: new FormControl(),
      passId: new FormControl(),
      id: new FormControl('', [Validators.required]),
    });

    this.refresh();

    this.adminClient.getCardVM().subscribe(
      result => {
        this.supplierList = result.suppliers;
        this.productList = result.products;
        this.passList = result.passes;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  refresh() {
    this.cardsClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openModal(entity: CardDto, template: TemplateRef<any>) {
    if (entity === null) {
      this.modalEditor.title = 'Create New Card';
      this.modalEditor.button = 'Save';
    } else {
      this.modalEditor.title = 'Update Pass: ' + entity.number;
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
    const newEntityCommand = CreateCardCommand.fromJS(this.entityForm.getRawValue());
    newEntityCommand.number = newEntityCommand.number.trim();
    newEntityCommand.alias = newEntityCommand.alias?.trim();

    this.cardsClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.makeEntityFromForm(result, this.entityForm);
            this.updateTable(entity);
            this.closeModal();
            this.openSnackBar(`Added successfully: ${entity.number}`, null);
          } else {
            this.openSnackBar('An error occured while saving the new Card.', null);
          }
        },
        error => {
          this.addErrorFromApi(error);
        }
    );
  }

  updateEntity() {
    const updateEntityCommand = UpdateCardCommand.fromJS(this.entityForm.getRawValue());
    updateEntityCommand.number = updateEntityCommand.number.trim();
    updateEntityCommand.alias = updateEntityCommand.alias?.trim();

    this.cardsClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const entity = this.makeEntityFromForm(null, this.entityForm);
          this.updateTable(entity);
          this.closeModal();
          this.openSnackBar(`Updated successfully: ${entity.number}`, null);
        },
        error => {
          this.addErrorFromApi(error);
        }
    );
  }

  private makeEntityFromForm(id: number, form: FormGroup): CardDto {
    const entity = CardDto.fromJS(form.getRawValue());
    entity.passName = this.passList.find(x => x.id === entity.passId)?.name;
    entity.productName = this.productList.find(x => x.id === entity.productId)?.name;
    entity.supplierName = this.supplierList.find(x => x.id === entity.supplierId).name;
    entity.taps = [];
    if (id !== null) {
      entity.id = id;
    }
    return entity;
  }

  private updateTable(entity: CardDto) {
    const index = this.dataSource.findIndex(x => x.id === entity.id);
    if (index < 0) {
      this.dataSource.push(entity);
    } else {
      this.dataSource.splice(index, 1, entity);
    }
    this.table.renderRows();
  }

  openDeleteModal(entity: CardDto, template: TemplateRef<any> ) {
    this.modalEditor.title = 'Delete Card: ' + entity.number;
    this.modalEditor.button = 'Delete';

    this.adminClient.getCardDelete(entity.id).subscribe(
      result => {
        this.entityToDeleteStats = result;
        this.entityForm.get('id').setValue(this.entityToDeleteStats.id);
        this.modalRef = this.modalService.show(template);
      },
      error => {
        this.addErrorFromApi(error);
      }
    );
  }

  deleteEntity() {
    const entityToDelete = this.dataSource.find(x => x.id === Number(this.entityForm.getRawValue()['id']));
    const userInput = String(this.entityForm.getRawValue()['number']);
    const entityParameter = entityToDelete.number.trim();

    if (userInput === entityParameter) {
      if (confirm('Are you really really sure?')) {
        this.cardsClient.delete(entityToDelete.id).subscribe(
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
      this.entityForm.get('number').setErrors({ mismatch: true });
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
