import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { ExporterComponent } from './exporter.component';

const routes: Routes = [
  {path: 'exporter', component: ExporterComponent, canActivate: [AuthorizeGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExporterRoutingModule { }
