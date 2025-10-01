import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ArticleListComponent} from "./article-list/article-list.component";
import {ArticleViewComponent} from "./article-view/article-view.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ArticleListComponent },
      { path: 'view/:articleId', component: ArticleViewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
