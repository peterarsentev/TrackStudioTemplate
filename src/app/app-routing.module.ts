import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PreventionComponent } from './prevention/prevention.component';


const routes: Routes = [
  { path: 'prevention', component: PreventionComponent
  },
  { path: '',
    loadChildren: () => import('./main/main.module').then(mod => mod.MainModule)
  },
  { path: 'task',
    loadChildren: () => import('./main/main.module').then(mod => mod.MainModule)
  },
  { path: 'tasks',
    loadChildren: () => import('./main/main.module').then(mod => mod.MainModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
