import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { EmailComponent } from './containers/email/email.component';
import { PasswordComponent } from './containers/password/password.component';
import { EditProfileComponent } from './containers/edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileNavComponent,
    children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full'},
      { path: 'edit', component: EditProfileComponent },
      { path: 'email', component: EmailComponent },
      { path: 'password', component: PasswordComponent }
    ]
  }
];
@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class ProfileRoutingModule {

}
