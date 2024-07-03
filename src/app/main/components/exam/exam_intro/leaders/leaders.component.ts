import { Component, OnInit } from '@angular/core';
import {LeaderModels} from '../../../../../shared/models/leader-models';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ExamuserService} from '../../../../../shared/services/examuser.service';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss']
})
export class LeadersComponent implements OnInit {

  leaders: LeaderModels[] = [];

  constructor(private examUserService: ExamuserService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.examUserService.getLeaders(this.route.snapshot.params.examId)
      .subscribe(res => this.leaders = res);
  }

  openProfile(userId, login) {
    this.router.navigate(['user', userId], { state: { login: login } });
  }
}
