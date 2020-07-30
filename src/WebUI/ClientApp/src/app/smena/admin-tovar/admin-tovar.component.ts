import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductDto, ProductsClient, UpdateProductCommand, CreateProductCommand } from 'src/app/taplog-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { IModal } from 'src/_interfaces/modal';
import { MatTable } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-admin-tovar',
  templateUrl: './admin-tovar.component.html',
  styleUrls: ['./admin-tovar.component.css']
})
export class AdminTovarComponent implements OnInit {
  debug = false;

  dataSource: ProductDto[] = [];
  columnList: string[] = ['id', 'name', 'edit', 'delete'];
  @ViewChild(MatTable) table: MatTable<any>;

  updateForm: FormGroup;
  createForm: FormGroup;
  modalRef: BsModalRef;
  modalEditor: IModal = {title: 'Editor', errors: null };

  constructor(private productsClient: ProductsClient, private modalService: BsModalService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
      id: new FormControl('', [Validators.required]),
    });
    this.createForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  refresh() {
    this.productsClient.getAll().subscribe(
      result => {
        this.dataSource = result;
      },
      error => this.openSnackBar(error.title, null)
    );
  }

  openUpdateModal(entity: ProductDto, template: TemplateRef<any>) {
    this.updateForm.patchValue(entity);
    this.updateForm.get('id').disable();
    this.modalEditor.title = 'Update Product: ' + entity.name;
    this.modalRef = this.modalService.show(template);
  }

  updateEntity() {
    const updateEntityCommand = UpdateProductCommand.fromJS(this.updateForm.getRawValue());

    this.productsClient.update(updateEntityCommand.id, updateEntityCommand).subscribe(
        result => {
          const index = this.dataSource.findIndex(x => x.id === updateEntityCommand.id);
          const updatedEntity = this.createEntityFromForm(this.updateForm);
          this.dataSource.splice(index, 1, updatedEntity);
          this.table.renderRows();
          this.closeModal(this.updateForm);
          this.openSnackBar(`Updated successfully: ${updatedEntity.name}`, null);
        },
        error => {
          this.openSnackBar(error.title, null);
        }
    );
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalEditor.title = 'Create New Product';
    this.modalRef = this.modalService.show(template);
  }

  saveEntity() {
    const newEntityCommand = CreateProductCommand.fromJS(this.createForm.getRawValue());

    this.productsClient.create(newEntityCommand).subscribe(
        result => {
          if (result > 0) {
            const entity = this.createEntityFromForm(this.createForm);
            entity.id = result;
            this.dataSource.push(entity);
            this.table.renderRows();
            this.closeModal(this.createForm);
            this.openSnackBar(`Added successfully: ${entity.name}`, null);
          } else {
            this.openSnackBar('An error occured while saving the new Product.', null);
          }
        },
        error => {
          this.openSnackBar(error.title, null);
        }
    );
  }

  private createEntityFromForm(form: FormGroup): ProductDto {
    const entity = ProductDto.fromJS(form.getRawValue());
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
    if (confirm('All Product data will be lost (Product, cards, taps)! Are you sure to delete Product?' + id)) {
      console.log('Change efcore to set id to null in cards');
      // this.productsClient.delete(id).subscribe(
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
