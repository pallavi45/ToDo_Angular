import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { ToDoComponent } from './to-do/to-do.component';
import { CompletedComponent } from './completed/completed.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
