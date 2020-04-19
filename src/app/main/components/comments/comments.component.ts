import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TasksService } from '../../../shared/services/tasks.service';
import { UserModels } from '../../../shared/models/user.models';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  form: FormGroup;
  toolbarOptions = {};
  config: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      image: [
        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']]
      ],
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear'
          ]
        ],
      ]
    },
    height: '150px',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear'
        ]
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['customButtons', ['testBtn']]
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true
  };
  mstatusId: string;
  taskId: string;
  handlers: UserModels[] = [];
  validationErrors = {
    handlerId: [
      { type: 'required', message: 'Выберете ответственного'}
    ],
    description: [
      { type: 'required', message: 'Введите комментарий'}
    ]
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private tasksService: TasksService) {};

  ngOnInit() {
    this.initForm();
    this.getRoutParams();
  }

  private initForm() {
    this.form = this.fb.group({
      description: ['', Validators.required],
      handlerId: ['', Validators.required]
    });
  }

  submitComment() {
    const handlerId = this.form.get('handlerId').value;
    let description = this.form.get('description').value;
    this.tasksService.sendComment(this.taskId, this.mstatusId, handlerId, description)
      .subscribe(() => {
        this.router.navigate(['/task'], {
          queryParams: {
            action: 'task',
            taskId: this.taskId
          }
        });
      })
  }


  private getRoutParams() {
    this.route.queryParams.pipe(
      switchMap(url => {
        this.taskId = url.taskId;
        this.mstatusId = url.mstatusId;
        return this.tasksService.gerResponsiblePeople(this.taskId, this.mstatusId);
      })
    ).subscribe(handlers => {
      this.handlers = handlers.handlers;
    })
  }

  selectPerson(user: UserModels) {
    this.form.get('handlerId').setValue(user.id);
  }
}
