import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CardDto, UpdateCardCommand, CreateCardCommand, CardsClient, SupplierDto,
  ProductDto, PassDto, PassesClient, ProductsClient, SuppliersClient, AdminClient } from 'src/app/taplog-api';
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
  debug = true;

  dataSource: CardDto[] = [];
  columnList: string[] = ['id', 'number', 'alias', 'supplierName', 'productName', 'passName', 'taps', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  supplierList: SupplierDto[] = [];
  productList: ProductDto[] = [];
  passList: PassDto[] = [];

  updateForm: FormGroup;
  createForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', errors: null };

  constructor(private cardsClient: CardsClient, private adminClient: AdminClient,
    private modalService: BsModalService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      number: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      alias: new FormControl('', [Validators.maxLength(32)]),
      supplierId: new FormControl(null, [Validators.required]),
      productId: new FormControl(),
      passId: new FormControl(),
      id: new FormControl('', [Validators.required]),
    });
    this.createForm = new FormGroup({
      number: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      alias: new FormControl('', [Validators.maxLength(32)]),
      supplierId: new FormControl(null, [Validators.required]),
      productId: new FormControl(),
      passId: new FormControl(),
    });

    this.adminClient.getCardVM().subscribe(
      result => {
        this.supplierList = result.suppliers;
        this.productList = result.products;
        this.passList = result.passes;
        console.log(result);
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  refresh() {
    this.cardsClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openUpdateModal(entity: CardDto, template: TemplateRef<any>) {
    this.updateForm.patchValue(entity);
    this.updateForm.get('id').disable();
    this.modalEditor.title = 'Update Card: ' + entity.number;
    this.modalRef = this.modalService.show(template);
  }

  updateEntity() {
    const updateEntityCommand = UpdateCardCommand.fromJS(this.updateForm.getRawValue());

    this.cardsClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const index = this.dataSource.findIndex(x => x.id === updateEntityCommand.id);
          const updatedEntity = this.createEntityFromForm(this.updateForm);
          this.dataSource.splice(index, 1, updatedEntity);
          this.table.renderRows();
          this.closeModal(this.updateForm);
          this.openSnackBar(`Updated successfully: ${updatedEntity.alias} ${updatedEntity.number}`, null);
        },
        error => {
          this.openSnackBar(error.title, null);
        }
    );
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalEditor.title = 'Create New Card';
    this.modalRef = this.modalService.show(template);
  }

  saveEntity() {
    const newEntityCommand = CreateCardCommand.fromJS(this.createForm.getRawValue());

    this.cardsClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.createEntityFromForm(this.createForm);
            entity.id = result;
            this.dataSource.push(entity);
            this.table.renderRows();
            this.closeModal(this.createForm);
            this.openSnackBar(`Added successfully: ${entity.alias} ${entity.number}`, null);
          } else {
            this.openSnackBar('An error occured while saving the new Card.', null);
          }
        },
        error => {
          this.openSnackBar(error.title, null);
        }
    );
  }

  private createEntityFromForm(form: FormGroup): CardDto {
    const entity = CardDto.fromJS(form.getRawValue());
    entity.passName = this.passList.find(x => x.id === entity.passId)?.name;
    entity.productName = this.productList.find(x => x.id === entity.productId)?.name;
    entity.supplierName = this.supplierList.find(x => x.id === entity.supplierId).name;
    entity.taps = [];
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
    if (confirm('All Card data will be lost (Card, cards, taps)! Are you sure to delete Card?' + id)) {
      console.log('Change efcore to set id to null in cards');
      // this.cardsClient.delete(id).subscribe(
      //   result => {
      //     // do something with no return
      //     const index = this.dataSource.findIndex(x => x.id === id);
      //     this.dataSource.splice(index, 1);
      //     this.table.renderRows();
      //     this.openSnackBar('Deleted successfully', null);
      //   },
      //   error => {this.openSnackBar(error.title, null);}
      // );
    }
  }
}
