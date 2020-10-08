import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HendlersComponent } from './components/hendlers/hendlers.component';
import { CommonModule } from '@angular/common';
import { RedactorComponent } from './components/redactor/redactor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '../main/components/comments/comments.component';

@NgModule({
  imports: [
    HttpClientModule,
    NgxSummernoteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HttpClientModule,
    NgxSummernoteModule,
    HendlersComponent,
    CommentsComponent,
    RedactorComponent
  ],
  declarations: [HendlersComponent, CommentsComponent, RedactorComponent]
})
export class SharedModule {

}
