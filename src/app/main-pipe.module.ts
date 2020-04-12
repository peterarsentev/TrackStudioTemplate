import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {ActStatusPipe} from "./ActStatusPipe.pipe"; // <---

@NgModule({
  declarations:[ActStatusPipe], // <---
  imports:[CommonModule],
  exports:[ActStatusPipe] // <---
})

export class MainPipe{}
