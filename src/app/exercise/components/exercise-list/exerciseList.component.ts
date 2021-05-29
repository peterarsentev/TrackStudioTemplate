import { Component, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../../../shared/services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavNode } from '../../../shared/models/nav.node';
import { NavService } from '../../../shared/services/nav.service';
import { pluck, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, zip } from 'rxjs';
import { TopicModels } from '../../../shared/models/topic.models';
import { CategoryModels } from '../../../shared/models/category.models';
import { LevelModels } from '../../../shared/models/level.models';
import { TopicFilter } from '../../../shared/models/topickFilter';

export enum FilterTopicEnum {
  EMPTY, LEVEL, CATEGORY
}

@Component({
  selector: 'app-exercise.list',
  templateUrl: './exerciseList.component.html',
  styleUrls: ['./exerciseList.component.scss'],
})
export class ExerciseListComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  tasks: TopicModels[];
  currentCategories: CategoryModels[] = [];
  levels: LevelModels[] = [];
  level: LevelModels;
  category: CategoryModels;

  constructor(private taskService: TasksService,
              private router: Router,
              private navService: NavService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.navService.setUpModel({...new NavNode(), exercise: true});
    this.route.data
      .pipe(pluck('data'),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => {
      this.tasks = res as TopicModels[];
      window.scrollTo(0, 0);
    });
    this.getLevels();
    this.getUserFilters();
  }

  showTask(id: any) {
    this.router.navigate([`${id}`], {relativeTo: this.route});
  }

  private getLevels() {
    this.taskService.getLevels().subscribe(res => this.levels = res);
  }

  private getCategoriesByLevel(id: number) {
    this.taskService.getCategoriesByLevel(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.currentCategories = res);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }


  selectLevel(level?: LevelModels) {
    if (!level) {
      this.deleteLevelAndCategory();
    } else {
      this.deleteCategoryAndSaveLevel(level);
    }
  }

  selectCat(category?: CategoryModels) {
    if (category) {
      if (this.category) {
        this.deleteAndSaveNewCat(category);
      } else {
        this.saveFilter(FilterTopicEnum.CATEGORY, category.id);
      }
    } else {
      this.deleteFilter(this.category.filterId);
    }
  }

  private getUserFilters() {
    this.taskService.getUserFilters()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.level = res.levels;
        if (res.levels) {
          this.getCategoriesByLevel(this.level.id);
        }
        this.category = res.categories;
      });
  }

  private getTasksTopicsList() {
    this.taskService.getTasksTopicsList()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.tasks = res);
  }


  private saveFilter(key: number, value: number) {
    this.taskService.saveFilter(key, value)
      .subscribe((res: TopicFilter) => {
        this.getUserFilters();
        this.getTasksTopicsList();
      });
  }

  private deleteFilter(id: number) {
    this.taskService.deleteTopicFilter(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.getUserFilters();
        this.getTasksTopicsList();
      });
  }

  private deleteAndSaveNewCat(category: CategoryModels) {
    this.taskService.deleteTopicFilter(this.category.filterId)
      .pipe(
        switchMap(() => this.taskService.saveFilter(FilterTopicEnum.CATEGORY, category.id)),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(() => {
      this.getUserFilters();
      this.getTasksTopicsList();
    });
  }

  private deleteLevelAndCategory() {
    if (!!this.category) {
      zip(this.taskService.deleteTopicFilter(this.category.filterId), this.taskService.deleteTopicFilter(this.level.filterId))
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.currentCategories = [];
          this.category = undefined;
          this.level = undefined;
          this.getTasksTopicsList();
        });
    } else {
      this.taskService.deleteTopicFilter(this.level.filterId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => {
          this.currentCategories = [];
          this.category = undefined;
          this.level = undefined;
          this.getTasksTopicsList();
        });
    }
  }

  private deleteCategoryAndSaveLevel(level: LevelModels) {
    if (this.category) {
      zip(this.taskService.deleteTopicFilter(this.category.filterId), this.taskService.deleteTopicFilter(this.level.filterId))
        .pipe(
          switchMap(() => this.taskService.saveFilter(FilterTopicEnum.LEVEL, level.id)),
          takeUntil(this.ngUnsubscribe$)
        ).subscribe(() => {
        this.getUserFilters();
        this.getTasksTopicsList();
        this.getCategoriesByLevel(level.id);
      });
    } else {
      if (this.level) {
        this.taskService.deleteTopicFilter(this.level.filterId)
          .pipe(switchMap(() => this.taskService.saveFilter(FilterTopicEnum.LEVEL, level.id)),
            takeUntil(this.ngUnsubscribe$)
          ).subscribe(() => {
          this.getUserFilters();
          this.getTasksTopicsList();
          this.getCategoriesByLevel(level.id);
        });
      } else {
        this.saveFilter(FilterTopicEnum.LEVEL, level.id);
        this.getCategoriesByLevel(level.id);
      }
    }
  }
}
