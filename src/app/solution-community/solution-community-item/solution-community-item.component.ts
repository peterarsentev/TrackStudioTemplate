import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {UserModels} from '../../shared/models/user.models';
import {ActivatedRoute, Router} from '@angular/router';
import {NavService} from '../../shared/services/nav.service';
import {AlertService} from '../../shared/services/alertService';
import {TasksService} from '../../shared/services/tasks.service';
import {SolutionCommunityService} from '../../shared/services/solution.community.service';
import {UserService} from '../../shared/services/user.service';
import {TaskCodeService} from '../../shared/services/task-code.service';
import {SolutionCommunityModel} from '../../shared/models/solution.community.model';
import {DiscussionBlockComponent} from '../../shared/components/discussion-block/discussion-block.component';
import {SolutionCommunityOperationModel} from '../../shared/models/solution.community.operation.model';

@Component({
  selector: 'app-solution-community-item',
  templateUrl: './solution-community-item.component.html',
  styleUrls: ['./solution-community-item.component.scss']
})
export class SolutionCommunityItemComponent implements OnInit {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  options = {
    lineNumbers: true,
    readOnly: true,
    mode: 'text/x-java',
  };
  name: string;
  description: string;
  code: string;
  created: number;
  solutionCommunity: SolutionCommunityModel;
  addFormComment = false;
  solutionCommunityOperations: SolutionCommunityOperationModel[];

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
    const solutionCommunityId = Number(this.route.snapshot.paramMap.get('solutionCommunityId'));
    this.solutionCommunityService
      .findById(solutionCommunityId)
      .subscribe(res => {
          this.solutionCommunity = res;
      });
    this.solutionCommunityService
      .findOperationsBySolutionCommunityId(solutionCommunityId)
      .subscribe(res => {
        this.solutionCommunityOperations = res;
      });
  }

  showAddCommentForm(show: boolean) {
    this.addFormComment = show;
  }

  saveComment($event: any) {
    this.addFormComment = false;
    this.solutionCommunityService.saveOperation(this.solutionCommunity.id, $event)
      .subscribe(res => {
        this.solutionCommunityOperations = [...this.solutionCommunityOperations, res];
      });

  }
}
