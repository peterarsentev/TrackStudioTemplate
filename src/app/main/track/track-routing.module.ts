import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JavaViewComponent} from './java-view/java-view.component';
import {GoViewComponent} from './go-view/go-view.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'java', component: JavaViewComponent },
      { path: 'go', component: GoViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule { }
