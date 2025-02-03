import { Component, OnInit } from '@angular/core';
import {CategoryModels} from '../../../../shared/models/category.models';
import {CategoryService} from '../../../../shared/services/category.service';
import {LevelService} from '../../../../shared/services/level.service';
import {Router} from '@angular/router';
import {NavService} from '../../../../shared/services/nav.service';
import {NavNode} from '../../../../shared/models/nav.node';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  categories: CategoryModels[];
  categoryById = new Map();
  levelById = new Map();

  constructor(private router: Router,
              private navService: NavService,
              private categoryService: CategoryService,
              private levelService: LevelService) { }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), courses: true });
    this.categoryService.getActiveCategories()
      .subscribe(rs => {
        this.categories = rs;
        this.categoryById = rs.reduce((acc, item) => {
          acc.set(item.id, item);
          return acc;
        }, new Map());
      });

    this.levelService.getLevels()
      .subscribe(rs => {
        this.levelById = rs.reduce((acc, item) => {
          acc.set(item.id, item);
          return acc;
        }, new Map());
      });
  }

  linkCourse(categoryId: number) {
    this.router.navigate(['courses', categoryId]);
  }

}
