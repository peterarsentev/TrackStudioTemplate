import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackRoutingModule } from './track-routing.module';
import { JavaViewComponent } from './java-view/java-view.component';
import { GoViewComponent } from './go-view/go-view.component';
import { BigtechViewComponent } from './bigtech-view/bigtech-view.component';
import { BootcampViewComponent } from './bootcamp-view/bootcamp-view.component';


@NgModule({
  declarations: [JavaViewComponent, GoViewComponent, BigtechViewComponent, BootcampViewComponent],
  imports: [
    CommonModule,
    TrackRoutingModule
  ]
})
export class TrackModule { }
