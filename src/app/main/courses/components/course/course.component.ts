import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavService} from '../../../../shared/services/nav.service';
import {CategoryService} from '../../../../shared/services/category.service';
import {CategoryLevelModels} from '../../../../shared/models/category.level.models';
import {NavNode} from '../../../../shared/models/nav.node';
import {UserService} from '../../../../shared/services/user.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  category: CategoryLevelModels;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private navService: NavService,
              private userService: UserService,
              private categoryService: CategoryService) { }

  ngOnInit() {
    const categoryId = Number(this.activatedRoute.snapshot.paramMap.get('categoryId'));
    this.navService.setUpModel({...new NavNode(), courseId: categoryId });
    this.categoryService.findByCategoryId(categoryId)
      .subscribe( rs => this.category = rs);
  }

  listToTask() {
    this.userService
      .getModel()
      .subscribe((user) => {
        if (user.login !== 'guest') {
          this.router.navigate(['exercise']);
        } else {
          this.router.navigate(['login']);
        }
      });
  }

  linkCourse(categoryId: number) {
    this.router.navigate(['courses', categoryId]);
  }
}
