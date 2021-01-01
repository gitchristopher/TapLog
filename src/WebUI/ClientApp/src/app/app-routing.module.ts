import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TapLoggerComponent } from './tap-logger/tap-logger.component';
import { TapperComponent } from './tapper/tapper.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'logger2', component: TapperComponent},
  {path: 'logger1', component: TapLoggerComponent},
  {path: 'todo', component: TodoComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

