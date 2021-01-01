import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExporterComponent } from './exporter.component';
import { QuerierComponent } from './querier/querier.component';
import { MaterialModule } from 'src/_modules/material.module';
import { PipeModule } from 'src/_modules/pipe.module';



@NgModule({
  declarations: [
      ExporterComponent,
      QuerierComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    PipeModule
  ]
})
export class ExporterModule { }
