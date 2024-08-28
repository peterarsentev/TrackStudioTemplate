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
import {OperationService} from '../../shared/services/operation.service';
import {EditorConfiguration} from 'codemirror';

declare var CodeMirror: any;
declare var hljs: any;
declare const window: any;

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
  text: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private navService: NavService,
              private alertService: AlertService,
              private taskService: TasksService,
              private solutionCommunityService: SolutionCommunityService,
              private operationService: OperationService,
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

    if (this.typeResource === 'task') {
      this.operationService
        .findById(this.resourceId)
        .subscribe(res => {
          this.name = res.taskName + ' [#' + res.taskNumber + ']';
          this.description = res.taskDescription;
          this.created = res.time;
          this.text = res.text;
          this.userService.getById(res.userId)
            .subscribe((rs: any) => this.userModels = rs.user);
        });
      setTimeout(() => {
        document.querySelectorAll('pre code').forEach((block) => {
          const java = block.parentElement.className.indexOf('run_main') > -1;
          this.sandBoxWidget(block, java);
        });
      }, 0);
    }
  }

  private sandBoxWidget(block, java) {
    // Create elements
    const codeEl = document.createElement('textarea');
    const outputEl = document.createElement('textarea');
    const buttonContainer = document.createElement('div');
    const copyButton = document.createElement('button');
    const div = document.createElement('div');
    const divEnd = document.createElement('div');

    // Add classes and inner text
    div.classList.add('pt-2');
    div.innerText = 'Вывод:';
    divEnd.classList.add('mt-3');
    buttonContainer.classList.add('mt-3', 'mb-1', 'd-flex', 'gap-2');

    copyButton.classList.add('btn', 'btn-light', 'btn-sm', 'ml-2');
    copyButton.innerHTML = '<i class="fa fa-copy mr-1"></i>Копировать';

    buttonContainer.appendChild(copyButton);

    // Insert elements before the block
    block.parentElement.before(buttonContainer);
    block.parentElement.before(codeEl);
    block.parentElement.before(divEnd);

    // Initialize CodeMirror
    const code = CodeMirror.fromTextArea(codeEl, {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-java',
    } as EditorConfiguration);

    // Set initial code value
    code.getDoc().setValue(
      block.innerHTML
        .split('<br>').join('\r\n')
        .split('&gt;').join('>')
        .split('&lt;').join('<')
        .split('&amp;').join('&')
    );

    // Fun error handler
    const handleError = (err) => {
      // Fun error message
      const messages = [
        'Oops! Something went wrong. 🤷‍♂️',
        'Whoops! Looks like the code ran into a snag. 🥴',
        'Error! The gremlins are at it again! 👾',
        'Yikes! The code hit a bump in the road. 🚧',
        'Oh no! Something broke. We\'ll fix it! 🛠️',
      ];
      const message = messages[Math.floor(Math.random() * messages.length)];
      alert(`${message}\n\nError details: ${err}`);
    };

    // Copy button event listener
    copyButton.addEventListener('click', () => {
      const codeText = code.getValue();
      navigator.clipboard.writeText(codeText).then(() => {
        const originalIcon = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fa fa-check mr-1"></i>Скопировано';
        setTimeout(() => {
          copyButton.innerHTML = originalIcon;
        }, 2000); // Revert icon back after 2 seconds
      }).catch(err => {
        alert('Failed to copy code: ' + err);
      });
    });

    // Remove the original block element
    block.parentElement.parentElement.removeChild(block.parentElement);
  }

  publishSolution() {
    if (this.typeResource === 'taskCode') {
      this.solutionCommunityService.publishSolution(
        this.resourceId, undefined
      ).subscribe(rs => this.router.navigate(['/solution_community', 'item', rs.id]));
    }
    if (this.typeResource === 'task') {
      this.solutionCommunityService.publishSolution(
        undefined, this.resourceId
      ).subscribe(rs => this.router.navigate(['/solution_community', 'item', rs.id]));
    }
  }
}
