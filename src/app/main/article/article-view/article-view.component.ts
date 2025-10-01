import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from '../../../shared/services/article.service';
import {ArticleModel} from '../../../shared/models/article.model';
import {NavNode} from '../../../shared/models/nav.node';
import {NavService} from '../../../shared/services/nav.service';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss']
})
export class ArticleViewComponent implements OnInit {

  article: ArticleModel;
  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private navService: NavService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.navService.setUpModel({...new NavNode(), article: true });
    let articleId = Number(this.activatedRoute.snapshot.paramMap.get('articleId'));
    this.articleService.getById(articleId)
      .subscribe(res => {
        this.article = res;
        this.navService.setUpModel({...new NavNode(), articleName: res.title, article: true });
      });
  }

  linkArticles() {
    this.router.navigate(['article']);
  }
}
