import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HendlersComponent } from './components/hendlers/hendlers.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    HttpClientModule,
    NgxSummernoteModule,
    CommonModule
  ],
    exports: [
        HttpClientModule,
        NgxSummernoteModule,
        HendlersComponent
    ],
  declarations: [HendlersComponent]
})
export class SharedModule {

}
