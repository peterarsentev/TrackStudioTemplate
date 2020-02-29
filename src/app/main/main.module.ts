import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { TasksComponent } from './components/tasks/tasks.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    LoginComponent,
    TasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MainRoutingModule,
    SharedModule
  ],
  entryComponents: [
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})
export class MainModule {

}
