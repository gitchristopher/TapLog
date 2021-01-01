import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AdminComponent } from './admin/admin.component';
import { ExporterComponent } from './exporter/exporter.component';
import { HomeComponent } from './home/home.component';
import { LoggerComponent } from './logger/logger.component';
import { TapLoggerComponent } from './tap-logger/tap-logger.component';
import { TapperComponent } from './tapper/tapper.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthorizeGuard]},
  {path: 'exporter', component: ExporterComponent, canActivate: [AuthorizeGuard]},
  {path: 'logger3', component: LoggerComponent, canActivate: [AuthorizeGuard]},
  {path: 'logger2', component: TapperComponent, canActivate: [AuthorizeGuard]},
  {path: 'logger1', component: TapLoggerComponent, canActivate: [AuthorizeGuard]},
  {path: 'todo', component: TodoComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

