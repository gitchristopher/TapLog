import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from 'src/_modules/material.module';
import { AdminCardComponent } from './admin-card/admin-card.component';
import { AdminDeviceComponent } from './admin-device/admin-device.component';
import { AdminPassComponent } from './admin-pass/admin-pass.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminStageComponent } from './admin-stage/admin-stage.component';
import { AdminSupplierComponent } from './admin-supplier/admin-supplier.component';
import { AdminComponent } from './admin.component';
import { PipeModule } from 'src/_modules/pipe.module';



@NgModule({
  declarations: [
    AdminComponent,
    AdminCardComponent,
    AdminDeviceComponent,
    AdminPassComponent,
    AdminProductComponent,
    AdminStageComponent,
    AdminSupplierComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PipeModule
  ]
})
export class AdminModule { }
