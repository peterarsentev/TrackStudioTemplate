import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacancyService } from '../../vacancy.service';
import { VacancyModels } from '../../../shared/models/vacancy.models';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';

@Component({
  selector: 'app-vacancies-list',
  templateUrl: './vacancies-list.component.html',
  styleUrls: ['./vacancies-list.component.scss']
})
export class VacanciesListComponent implements OnInit {
  vacancies: VacancyModels[] = [];
  user: UserModels;
  open: boolean;
  my: boolean;
  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private vacancyService: VacancyService) { }

  ngOnInit() {
    this.userService.getModel()
      .subscribe(res => this.user = res);
    this.getVacancies();
  }

  gotoDetail(id?: number) {
    this.router.navigate(['detail', id ? `${id}` : 'create'], { relativeTo: this.route });
  }

  goToView(id: number) {
    this.router.navigate(['view', `${id}`], { relativeTo: this.route });
  }

  delete(id: number) {
    this.vacancyService.delete(id)
      .subscribe(() => this.getVacancies());
  }

  getVac(open: boolean, my: boolean) {
    this.open = open;
    this.my = my;
    this.getVacancies();
  }

  private getVacancies() {
    this.vacancyService.getAll(this.open, this.my)
      .subscribe(res => this.vacancies = res);
  }
}
