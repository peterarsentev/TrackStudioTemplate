import { Component, OnInit } from '@angular/core';
import {CategoryModels} from '../../../../shared/models/category.models';
import {CategoryService} from '../../../../shared/services/category.service';
import {LevelModels} from '../../../../shared/models/level.models';
import {LevelService} from '../../../../shared/services/level.service';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {

  categories: CategoryModels[];
  categoryById = new Map();
  levelById = new Map();

  constructor(private categoryService: CategoryService,
              private levelService: LevelService) { }

  ngOnInit() {
    this.categoryService.getCategories()
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
}
