import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerRoutingModule } from './logger-routing.module';
import { MaterialModule } from 'src/_modules/material.module';
import { ListExecutionComponent } from './list-execution/list-execution.component';
import { ListStageComponent } from './list-stage/list-stage.component';
import { ListTapComponent } from './list-tap/list-tap.component';
import { ListTestComponent } from './list-test/list-test.component';
import { LogTapComponent } from './log-tap/log-tap.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap';
import { LoggerComponent } from './logger.component';
import { PipeModule } from 'src/_modules/pipe.module';

@NgModule({
  declarations: [
    LoggerComponent,
    ListExecutionComponent,
    ListStageComponent,
    ListTapComponent,
    ListTestComponent,
    LogTapComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoggerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PipeModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ]
})
export class LoggerModule { }
