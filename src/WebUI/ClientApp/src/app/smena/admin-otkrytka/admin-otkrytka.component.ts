import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CardDto, UpdateCardCommand, CreateCardCommand, CardsClient, SupplierDto, ProductDto, PassDto, PassesClient, ProductsClient, SuppliersClient, TapDto } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-otkrytka',
  templateUrl: './admin-otkrytka.component.html',
  styleUrls: ['./admin-otkrytka.component.css']
})
export class AdminOtkrytkaComponent implements OnInit {
  dataSource: CardDto[] = [];
  columnList: string[] = ['id', 'number', 'alias', 'supplierName', 'productName', 'passName', 'taps', 'edit', 'delete'];

  updateModalRef: BsModalRef;
  selectedEntity = new CardDto();
  createModalRef: BsModalRef;
  newEntity = new CardDto();
  modalEditor: IModal = {title: 'Editor', errors: null };
  supplierList: SupplierDto[] = [];
  productList: ProductDto[] = [];
  passList: PassDto[] = [];
  ufg: FormGroup;
  cfg: FormGroup;
  debug = true;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private cardsClient: CardsClient, private passesClient: PassesClient,
    private productsClient: ProductsClient, private suppliersClient: SuppliersClient, private modalService: BsModalService) { }

  ngOnInit() {
    this.ufg = new FormGroup({
      number: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      alias: new FormControl('', [Validators.maxLength(32)]),
      supplierId: new FormControl('', [Validators.required]),
      productId: new FormControl(''),
      passId: new FormControl(''),
      id: new FormControl('', [Validators.required]),
    });
    this.cfg = new FormGroup({
      number: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      alias: new FormControl('', [Validators.maxLength(32)]),
      supplierId: new FormControl('', [Validators.required]),
      productId: new FormControl(''),
      passId: new FormControl(''),
    });
  }

  refresh() {
    this.cardsClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => console.error(error)
    );
    this.passesClient.getAll().subscribe(
      result => {
        this.passList = result;
      },
      error => console.error(error)
    );
    this.productsClient.getAll().subscribe(
      result => {
        this.productList = result;
      },
      error => console.error(error)
    );
    this.suppliersClient.getAll().subscribe(
      result => {
        this.supplierList = result;
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

    this.cardsClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
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
    this.selectedEntity.number = this.ufg.value.number;
    this.selectedEntity.alias = this.ufg.value.alias;
    this.selectedEntity.supplierId = Number(this.ufg.value.supplierId);
    this.selectedEntity.productId = String(this.ufg.value.productId).length < 1 ? null : Number(this.ufg.value.productId);
    this.selectedEntity.passId = String(this.ufg.value.passId).length < 1 ? null : Number(this.ufg.value.passId);
    const updatedEntity = UpdateCardCommand.fromJS(this.selectedEntity);
    return updatedEntity;
  }

  saveEntity() {
    const entity = this.createNewEntityFromForm();

    this.cardsClient.create(entity).subscribe(
        result => {
          if (result > 0) {
            this.newEntity.id = result;
            this.newEntity.taps = [];
            this.dataSource.push(CardDto.fromJS(this.newEntity));
            this.table.renderRows();
            this.modalEditor.errors = null;
            this.createModalRef.hide();
          } else {
            this.modalEditor.errors.push('An error occured while saving the new Card.');
          }
        },
        error => {
            const errors = JSON.parse(error.response);
            console.error('Error while creating a Card.');
            if (errors && errors.Title) {
                this.modalEditor.errors.push(errors.Title[0]);
            }
        }
    );
  }

  private createNewEntityFromForm() {
    this.newEntity = new CardDto();
    this.newEntity.number = this.cfg.value.number;
    this.newEntity.alias = this.cfg.value.alias;
    this.newEntity.supplierId = Number(this.cfg.value.supplierId);
    this.newEntity.productId = String(this.cfg.value.productId).length < 1 ? null : Number(this.cfg.value.productId);
    this.newEntity.passId = String(this.cfg.value.passId).length < 1 ? null : Number(this.cfg.value.passId);
    const entity = CreateCardCommand.fromJS(this.newEntity);
    return entity;
  }

  openUpdateModal(entity: CardDto, template: TemplateRef<any>) {
    this.setUpdateModalFieldValues(entity);
    this.updateModalRef = this.modalService.show(template);
  }

  private setUpdateModalFieldValues(entity: CardDto) {
    const updatedEntity = CardDto.fromJS(this.dataSource.find(x => x.id === entity.id));

    this.ufg.get('number').setValue(updatedEntity.number);
    this.ufg.get('alias').setValue(updatedEntity.alias);
    this.ufg.get('supplierId').setValue(updatedEntity.supplierId);
    this.ufg.get('productId').setValue(updatedEntity.productId);
    this.ufg.get('passId').setValue(updatedEntity.passId);
    this.ufg.get('id').setValue(updatedEntity.id);

    this.ufg.get('id').disable();
    this.modalEditor.title = 'Update Card: ' + updatedEntity.number;
    this.selectedEntity = updatedEntity;
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalEditor.title = 'Create New Card';
    this.createModalRef = this.modalService.show(template);
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
      //   },
      //   error => console.error(error)
      // );
    }
  }
}
