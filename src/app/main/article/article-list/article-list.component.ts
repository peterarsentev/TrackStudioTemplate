import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ArticleService} from '../../../shared/services/article.service';
import {ArticleModel} from '../../../shared/models/article.model';
import {NavNode} from '../../../shared/models/nav.node';
import {NavService} from '../../../shared/services/nav.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {

  articles: ArticleModel[] = [];

  constructor(
    private articleService: ArticleService,
    private navService: NavService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.navService.setUpModel({...new NavNode(), article: true });
    this.articleService.getAllArticles()
      .subscribe(res => {
        this.articles = res;
        console.log(res)
      });
  }

  goToArticle(article: ArticleModel) {
    this.router.navigate(['article', 'view', article.id]);
  }
}
