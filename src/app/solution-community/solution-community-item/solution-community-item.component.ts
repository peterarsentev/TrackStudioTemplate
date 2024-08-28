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
import {NavNode} from '../../shared/models/nav.node';
import {EditorConfiguration} from 'codemirror';

declare var CodeMirror: any;
declare var hljs: any;
declare const window: any;

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
    this.navService.setUpModel({...new NavNode(), solution_community: true });
    const solutionCommunityId = Number(this.route.snapshot.paramMap.get('solutionCommunityId'));
    this.solutionCommunityService
      .findById(solutionCommunityId)
      .subscribe(res => {
          this.solutionCommunity = res;
          this.prepareCode();
      });
    this.solutionCommunityService
      .findOperationsBySolutionCommunityId(solutionCommunityId)
      .subscribe(res => {
        this.solutionCommunityOperations = res;
        this.prepareCode();
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

  private prepareCode() {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach((block) => {
        const java = block.parentElement.className.indexOf('run_main') > -1;
        this.sandBoxWidget(block, java);
      });
    }, 0);
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
    block.parentElement.parentElement.removeChild(block.parentElement);
  }
}
