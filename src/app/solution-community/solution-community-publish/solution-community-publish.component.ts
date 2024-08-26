import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {SolutionTaskCodeModels} from '../../shared/models/solution.task.code.models';
import {UserModels} from '../../shared/models/user.models';
import {ActivatedRoute, Router} from '@angular/router';
import {NavService} from '../../shared/services/nav.service';
import {AlertService} from '../../shared/services/alertService';
import {TasksService} from '../../shared/services/tasks.service';
import {UserService} from '../../shared/services/user.service';
import {TaskCodeService} from '../../shared/services/task-code.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {NavNode} from '../../shared/models/nav.node';
import {SolutionCommunityService} from '../../shared/services/solution.community.service';

@Component({
  selector: 'app-solution-community',
  templateUrl: './solution-community-publish.component.html',
  styleUrls: ['./solution-community-publish.component.scss']
})
export class SolutionCommunityPublishComponent implements OnInit {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  options = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-java',
  };
  name: string;
  description: string;
  typeResource: string;
  resourceId: number;
  userModels: UserModels;
  code: string;
  created: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private navService: NavService,
              private alertService: AlertService,
              private taskService: TasksService,
              private solutionCommunityService: SolutionCommunityService,
              private userService: UserService,
              private taskCodeService: TaskCodeService) {
  }

  ngOnInit() {
    this.typeResource = this.route.snapshot.paramMap.get('typeResource');
    this.resourceId = Number(this.route.snapshot.paramMap.get('resourceId'));
    if (this.typeResource === 'taskCode') {
        this.taskCodeService
          .getSolution(this.resourceId)
          .subscribe(res => {
             this.name = res.taskcode.name;
             this.description = res.taskcode.description;
             this.code = res.solution.code;
             this.created = res.solution.updatedTime;
             this.userService.getById(res.solution.userId)
               .subscribe((rs: any) => this.userModels = rs.user);
          });
    }
  }

  publishSolution() {
    if (this.typeResource === 'taskCode') {
      this.solutionCommunityService.publishSolution(
        this.resourceId, undefined
      ).subscribe(rs => this.router.navigate(['/solution_community', 'item', rs.id]));
    }
  }
}
