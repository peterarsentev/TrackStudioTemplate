import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { EmailComponent } from './containers/email/email.component';
import { PasswordComponent } from './containers/password/password.component';
import { EditProfileComponent } from './containers/edit-profile/edit-profile.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations:[
    ProfileNavComponent,
    EmailComponent,
    PasswordComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProfileRoutingModule,
    SharedModule
  ],
  providers:[]
})
export class ProfileModule {

}
