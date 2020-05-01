import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { PasswordComponent } from './containers/password/password.component';
import { EditProfileComponent } from './containers/edit-profile/edit-profile.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './containers/profile/profile.component';

@NgModule({
  declarations:[
    ProfileNavComponent,
    PasswordComponent,
    EditProfileComponent,
    ProfileComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
        ProfileRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ],
  providers:[]
})
export class ProfileModule {

}
