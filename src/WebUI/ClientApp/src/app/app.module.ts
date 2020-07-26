import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TodoComponent } from './todo/todo.component';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

import { TapLoggerComponent } from './tap-logger/tap-logger.component';
import { HomeComponent } from './home/home.component';

import { TapperComponent } from './tapper/tapper.component';
import { StageListComponent } from './tapper/stage-list/stage-list.component';
import { TestListComponent } from './tapper/test-list/test-list.component';
import { ExecuteListComponent } from './tapper/execute-list/execute-list.component';
import { LogTapComponent } from './tapper/log-tap/log-tap.component';
import { TapListComponent } from './tapper/tap-list/tap-list.component';
import { StolComponent } from './stol/stol.component';
import { ZaprosComponent } from './stol/zapros/zapros.component';
import { SmenaComponent } from './smena/smena.component';

import { ResultEnumPipe } from '../_pipes/ResultEnumPipe';
import { ExpectedEnumPipe } from '../_pipes/ExpectedEnumPipe';
import { TapActionToArrayPipe } from '../_pipes/TapActionToArray.pipe';
import { TapActionEnumPipe } from '../_pipes/TapActionEnum.pipe';
import { TesterNamePipe } from '../_pipes/TesterName.pipe';

import { ZapolnitComponent } from './zapolnit/zapolnit.component';
import { SpisokFazComponent } from './zapolnit/spisok-faz/spisok-faz.component';
import { SpisokKazneyComponent } from './zapolnit/spisok-kazney/spisok-kazney.component';
import { SpisokSobytiyComponent } from './zapolnit/spisok-sobytiy/spisok-sobytiy.component';
import { SpisokTestovComponent } from './zapolnit/spisok-testov/spisok-testov.component';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

import { MatTableExporterModule } from 'mat-table-exporter';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { fazReducer } from '../app/zapolnit/spisok-faz/spisok-faz.reducers';
import { testovReducer } from '../app/zapolnit/spisok-testov/spisok-testov.reducers';
import { FazEffects } from '../app/zapolnit/spisok-faz/spisok-faz.effects';
import { TestovEffects } from '../app/zapolnit/spisok-testov/spisok-testov.effects';
import { kazneyReducer } from './zapolnit/spisok-kazney/spisok-kazney.reducers';
import { KazneyEffects } from './zapolnit/spisok-kazney/spisok-kazney.effects';


@NgModule({
   declarations: [
      AppComponent,
      NavMenuComponent,
      TapperComponent,
      CounterComponent,
      FetchDataComponent,
      TodoComponent,
      HomeComponent,
      TapLoggerComponent,
      StageListComponent,
      TestListComponent,
      ExecuteListComponent,
      LogTapComponent,
      TapListComponent,
      ResultEnumPipe,
      ExpectedEnumPipe,
      TapActionEnumPipe,
      TapActionToArrayPipe,
      TesterNamePipe,
      ZapolnitComponent,
      SpisokFazComponent,
      SpisokKazneyComponent,
      SpisokSobytiyComponent,
      SpisokTestovComponent,
      StolComponent,
      ZaprosComponent,
      SmenaComponent
   ],
   imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'todo', component: TodoComponent, canActivate: [AuthorizeGuard] },
      { path: 'versionOne', component: TapLoggerComponent, canActivate: [AuthorizeGuard] },
      { path: 'logger', component: TapperComponent, pathMatch: 'full', canActivate: [AuthorizeGuard] },
      { path: 'zapolnit', component: ZapolnitComponent, canActivate: [AuthorizeGuard] },
      { path: 'stol', component: StolComponent, canActivate: [AuthorizeGuard] },
      { path: 'smena', component: SmenaComponent },
    ]),
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatBadgeModule,
    MatMenuModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    StoreModule.forRoot({
      stages: fazReducer,
      tests: testovReducer,
      executions: kazneyReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([FazEffects, TestovEffects, KazneyEffects])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
