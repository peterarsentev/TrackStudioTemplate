import { Component, OnInit } from '@angular/core';
import { VacancyService } from '../../vacancy.service';
import { ActivatedRoute } from '@angular/router';
import { VacancyModels } from '../../../shared/models/vacancy.models';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-vacancy-view',
  templateUrl: './vacancy-view.component.html',
  styleUrls: ['./vacancy-view.component.scss']
})
export class VacancyViewComponent implements OnInit {
  vacancy = new VacancyModels();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .pipe(pluck('data'))
      .subscribe((res: VacancyModels) => this.vacancy = res);
  }

}
