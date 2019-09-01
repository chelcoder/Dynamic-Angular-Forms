import { ModalComponent } from './modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [ModalComponent],
  providers: [],
})
export class xModalModule { }