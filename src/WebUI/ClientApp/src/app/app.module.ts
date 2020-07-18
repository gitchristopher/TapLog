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

import { ResultEnumPipe } from '../_pipes/ResultEnumPipe';
import { ExpectedEnumPipe } from '../_pipes/ExpectedEnumPipe';

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

import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';


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
    ZapolnitComponent,
    SpisokFazComponent,
    SpisokKazneyComponent,
    SpisokSobytiyComponent,
    SpisokTestovComponent,
   ],
   imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'todo', component: TodoComponent, canActivate: [AuthorizeGuard] },
      { path: 'versionOne', component: TapLoggerComponent, canActivate: [AuthorizeGuard] },
      { path: 'versionTwo', component: TapperComponent, pathMatch: 'full', canActivate: [AuthorizeGuard]  },
      { path: 'zapolnit', component: ZapolnitComponent, canActivate: [AuthorizeGuard] },
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
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
