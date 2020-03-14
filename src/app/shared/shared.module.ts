import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  imports: [
    HttpClientModule,
    NgxSummernoteModule
  ],
  exports: [
    HttpClientModule,
    NgxSummernoteModule
  ]
})
export class SharedModule {

}
