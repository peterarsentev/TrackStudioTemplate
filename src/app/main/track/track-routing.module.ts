import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JavaViewComponent} from './java-view/java-view.component';
import {GoViewComponent} from './go-view/go-view.component';
import {BigtechViewComponent} from './bigtech-view/bigtech-view.component';
import {BootcampViewComponent} from './bootcamp-view/bootcamp-view.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'java', component: JavaViewComponent },
      { path: 'go', component: GoViewComponent },
      { path: 'bigtech', component: BigtechViewComponent },
      { path: 'bootcamp', component: BootcampViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackRoutingModule { }
