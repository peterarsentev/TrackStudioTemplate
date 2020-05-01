import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { PasswordComponent } from './containers/password/password.component';
import { EditProfileComponent } from './containers/edit-profile/edit-profile.component';
import { ProfileComponent } from './containers/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileNavComponent,
    children: [
      { path: '', component: ProfileComponent },
      { path: 'edit', component: EditProfileComponent },
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
