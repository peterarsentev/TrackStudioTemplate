import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoModel } from '../../../shared/models/info.model';
import { InfoService } from './info.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  page = 0;
  paginationAllowed = true;
  scrollDistance = 4;
  throttle = 500;
  infoList: InfoModel[] = [];
  hasNext = false;
  constructor(private router: Router, private infoService: InfoService) { }

  ngOnInit() {
    this.getListFirstTime();
  }

  onScrollDown() {
    this.page++;
    if (this.hasNext) {
      this.getList();
    }
  }

  goTo(info: any) {
    this.router.navigate([info.url]);
  }

  private getList() {
    this.infoService.getList(this.page)
      .subscribe(res => {
        this.infoList = this.infoList.concat(res);
        console.log(this.infoList)
        this.hasNext = res.length === 10;
        this.paginationAllowed = res.length === 10;
      });
  }

  private getListFirstTime() {
    this.infoService.getList(this.page)
      .subscribe(res => {
        this.infoList = res;
        this.hasNext = res.length === 10;
        this.paginationAllowed = res.length === 10;
      });
  }
}
