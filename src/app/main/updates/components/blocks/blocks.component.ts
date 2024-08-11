import { Component, OnInit } from '@angular/core';
import {CategoryModels} from '../../../../shared/models/category.models';
import {CategoryService} from '../../../../shared/services/category.service';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {

  categories: CategoryModels[];
  categoryById = new Map();

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getCategories()
      .subscribe(rs => {
        this.categories = rs;
        this.categoryById = rs.reduce((acc, item) => {
          acc.set(item.id, item);
          return acc;
        }, new Map());
      });
  }
}
