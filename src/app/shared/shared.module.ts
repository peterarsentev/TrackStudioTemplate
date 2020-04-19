import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HendlersComponent } from './components/hendlers/hendlers.component';
import { CommonModule } from '@angular/common';
import { RedactorComponent } from './components/redactor/redactor.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    HttpClientModule,
    NgxSummernoteModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    HttpClientModule,
    NgxSummernoteModule,
    HendlersComponent,
    RedactorComponent
  ],
  declarations: [HendlersComponent, RedactorComponent]
})
export class SharedModule {

}
