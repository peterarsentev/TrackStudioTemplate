import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacancyModels } from '../../../shared/models/vacancy.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';
import { VacancyService } from '../../vacancy.service';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.scss']
})
export class VacancyDetailsComponent implements OnInit {
  vacancy: VacancyModels;
  form: FormGroup;
  private user: UserModels;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private vacancyService: VacancyService) { }

  ngOnInit() {
    this.userService.getModel()
      .subscribe(user => this.user = user);
    this.buildForm();
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id === 'create') {
        this.vacancy = new VacancyModels();
      } else {
        this.vacancyService.getById(id)
          .subscribe(vac => {
            this.vacancy = vac;
            this.populateForm();
          });
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  setDescription(desc: string) {
    this.form.get('description').setValue(desc);
  }

  setOpen() {
    this.vacancy.open = !this.vacancy.open;
  }

  save() {
    this.vacancy.name = this.form.get('name').value;
    this.vacancy.description = this.form.get('description').value;
    if (!this.vacancy.id) {
      this.vacancyService.save(this.vacancy)
        .subscribe(res => this.router.navigate(['vacancies', 'view', `${res.id}`]));
    } else {
      this.vacancyService.update(this.vacancy)
        .subscribe(res => this.router.navigate(['vacancies', 'view', `${res.id}`]));
    }
  }

  private populateForm() {
    this.form = this.fb.group({
      name: [this.vacancy.name, Validators.required],
      description: [this.vacancy.description, Validators.required],
    });
  }
}
