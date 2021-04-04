import { Component, OnInit } from '@angular/core';
import { VacancyService } from '../../vacancy.service';
import { ActivatedRoute } from '@angular/router';
import { VacancyModels } from '../../../shared/models/vacancy.models';

@Component({
  selector: 'app-vacancy-view',
  templateUrl: './vacancy-view.component.html',
  styleUrls: ['./vacancy-view.component.scss']
})
export class VacancyViewComponent implements OnInit {
  vacancy = new VacancyModels();

  constructor(private route: ActivatedRoute, private vacancyService: VacancyService) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.vacancyService.getById(res.id)
        .subscribe(vac => this.vacancy = vac);
    });
  }

}
