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
import { LogTapComponent } from './tapper/log-tap/log-tap.component';
import { TapListComponent } from './tapper/tap-list/tap-list.component';

// THIRD ITERATION OF TAP LOGGER
import { ZapolnitComponent } from './zapolnit/zapolnit.component';
import { SpisokFazComponent } from './zapolnit/spisok-faz/spisok-faz.component';
import { SpisokKazneyComponent } from './zapolnit/spisok-kazney/spisok-kazney.component';
import { SpisokSobytiyComponent } from './zapolnit/spisok-sobytiy/spisok-sobytiy.component';
import { SpisokTestovComponent } from './zapolnit/spisok-testov/spisok-testov.component';
import { ZapisSobytiyComponent } from './zapolnit/zapis-sobytiy/zapis-sobytiy.component';

// QUERY AREA
import { StolComponent } from './stol/stol.component';
import { ZaprosComponent } from './stol/zapros/zapros.component';

// ADMIN AREA
import { SmenaComponent } from './smena/smena.component';
import { AdminEtapComponent } from './smena/admin-etap/admin-etap.component';
import { AdminSkhemaComponent } from './smena/admin-skhema/admin-skhema.component';
import { AdminBumagaComponent } from './smena/admin-bumaga/admin-bumaga.component';
import { AdminTovarComponent } from './smena/admin-tovar/admin-tovar.component';
import { AdminUstroystvoComponent } from './smena/admin-ustroystvo/admin-ustroystvo.component';
import { AdminOtkrytkaComponent } from './smena/admin-otkrytka/admin-otkrytka.component';

// PIPES
import { ResultEnumPipe } from '../_pipes/ResultEnumPipe';
import { ExpectedEnumPipe } from '../_pipes/ExpectedEnumPipe';
import { TapActionToArrayPipe } from '../_pipes/TapActionToArray.pipe';
import { TapActionEnumPipe } from '../_pipes/TapActionEnum.pipe';
import { TesterNamePipe } from '../_pipes/TesterName.pipe';

// NGRX STATE
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { fazReducer } from '../app/zapolnit/spisok-faz/spisok-faz.reducers';
import { testovReducer } from '../app/zapolnit/spisok-testov/spisok-testov.reducers';
import { kazneyReducer } from './zapolnit/spisok-kazney/spisok-kazney.reducers';
import { sobytiyReducer } from './zapolnit/spisok-sobytiy/spisok-sobytiy.reducers';
import { FazEffects } from '../app/zapolnit/spisok-faz/spisok-faz.effects';
import { TestovEffects } from '../app/zapolnit/spisok-testov/spisok-testov.effects';
import { KazneyEffects } from './zapolnit/spisok-kazney/spisok-kazney.effects';
import { SobytiyEffects } from './zapolnit/spisok-sobytiy/spisok-sobytiy.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';



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
      LogTapComponent,
      TapListComponent,
      // 3RD ITERATION OF TAP LOGGER
      ZapolnitComponent,
      SpisokFazComponent,
      SpisokKazneyComponent,
      SpisokSobytiyComponent,
      SpisokTestovComponent,
      ZapisSobytiyComponent,
      // QUERY AREA
      StolComponent,
      ZaprosComponent,
      // ADMINA AREA
      SmenaComponent,
      AdminEtapComponent,
      AdminSkhemaComponent,
      AdminBumagaComponent,
      AdminTovarComponent,
      AdminUstroystvoComponent,
      AdminOtkrytkaComponent,
      // PIPES
      ResultEnumPipe,
      ExpectedEnumPipe,
      TapActionEnumPipe,
      TapActionToArrayPipe,
      TesterNamePipe
   ],
   imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ApiAuthorizationModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'todo', component: TodoComponent, canActivate: [AuthorizeGuard] },
      { path: 'versionOne', component: TapLoggerComponent, canActivate: [AuthorizeGuard] },
      { path: 'versionTwo', component: TapperComponent, pathMatch: 'full', canActivate: [AuthorizeGuard] },
      { path: 'versionThree', component: ZapolnitComponent, canActivate: [AuthorizeGuard] },
      { path: 'stol', component: StolComponent, canActivate: [AuthorizeGuard] },
      { path: 'smena', component: SmenaComponent, canActivate: [AuthorizeGuard] },
    ]),
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    StoreModule.forRoot({
      stages: fazReducer,
      tests: testovReducer,
      executions: kazneyReducer,
      taps: sobytiyReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([FazEffects, TestovEffects, KazneyEffects, SobytiyEffects])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
