import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap';
import { environment } from '../environments/environment';

// MISC
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TodoComponent } from './todo/todo.component';
import { HomeComponent } from './home/home.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { MaterialModule } from 'src/_modules/material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

// FIRST ITERATION OF TAP LOGGER
import { TapLoggerComponent } from './tap-logger/tap-logger.component';

// SECOND ITERATION OF TAP LOGGER
import { TapperComponent } from './tapper/tapper.component';
import { StageListComponent } from './tapper/stage-list/stage-list.component';
import { TestListComponent } from './tapper/test-list/test-list.component';
import { ExecuteListComponent } from './tapper/execute-list/execute-list.component';
import { TapLogComponent } from './tapper/tap-log/tap-log.component';
import { TapListComponent } from './tapper/tap-list/tap-list.component';

// THIRD ITERATION OF TAP LOGGER
// import { LoggerComponent } from './logger/logger.component';
// import { ListStageComponent } from './logger/list-stage/list-stage.component';
// import { ListExecutionComponent } from './logger/list-execution/list-execution.component';
// import { ListTapComponent } from './logger/list-tap/list-tap.component';
// import { ListTestComponent } from './logger/list-test/list-test.component';
// import { LogTapComponent } from './logger/log-tap/log-tap.component';

// QUERY AREA
// import { ExporterComponent } from './exporter/exporter.component';
// import { QuerierComponent } from './exporter/querier/querier.component';

// ADMIN AREA
// import { AdminComponent } from './admin/admin.component';
// import { AdminStageComponent } from './admin/admin-stage/admin-stage.component';
// import { AdminSupplierComponent } from './admin/admin-supplier/admin-supplier.component';
// import { AdminPassComponent } from './admin/admin-pass/admin-pass.component';
// import { AdminProductComponent } from './admin/admin-product/admin-product.component';
// import { AdminDeviceComponent } from './admin/admin-device/admin-device.component';
// import { AdminCardComponent } from './admin/admin-card/admin-card.component';

// PIPES
import { ResultEnumPipe } from '../_pipes/ResultEnumPipe';
import { ExpectedEnumPipe } from '../_pipes/ExpectedEnumPipe';
import { TapActionToArrayPipe } from '../_pipes/TapActionToArray.pipe';
import { TapActionEnumPipe } from '../_pipes/TapActionEnum.pipe';
import { TesterNamePipe } from '../_pipes/TesterName.pipe';

// NGRX STATE
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StageReducer } from './logger/list-stage/list-stage.reducers';
import { TestReducer } from './logger/list-test/list-test.reducers';
import { ExecutionReducer } from './logger/list-execution/list-execution.reducers';
import { TapReducer } from './logger/list-tap/list-tap.reducers';
import { StageEffects } from './logger/list-stage/list-stage.effects';
import { TestEffects } from './logger/list-test/list-test.effects';
import { ExecutionEffects } from './logger/list-execution/list-execution.effects';
import { TapEffects } from './logger/list-tap/list-tap.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { ExporterModule } from './exporter/exporter.module';
import { AdminModule } from './admin/admin.module';
import { LoggerModule } from './logger/logger.module';
import { PipeModule } from 'src/_modules/pipe.module';



@NgModule({
   declarations: [
      AppComponent,
      NavMenuComponent,
      TodoComponent,
      HomeComponent,
      // 1ST ITERATION OF TAP LOGGER
      TapperComponent,
      // 2ND ITERATION OF TAP LOGGER
      TapLoggerComponent,
      StageListComponent,
      TestListComponent,
      ExecuteListComponent,
      TapLogComponent,
      TapListComponent,
      // 3RD ITERATION OF TAP LOGGER IMPORTED
   ],
   imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ApiAuthorizationModule,
    FormsModule,
    MaterialModule,
    AdminModule,
    ExporterModule,
    LoggerModule,
    PipeModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    StoreModule.forRoot({
      stages: StageReducer,
      tests: TestReducer,
      executions: ExecutionReducer,
      taps: TapReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([StageEffects, TestEffects, ExecutionEffects, TapEffects])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
