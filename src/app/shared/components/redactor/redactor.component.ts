import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-redactor',
  templateUrl: './redactor.component.html',
  styleUrls: ['./redactor.component.scss']
})
export class RedactorComponent implements OnInit, OnDestroy {

  @Input()titleLabel: string;
  @Output() outputEmitter: EventEmitter<string> = new EventEmitter<string>();
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

  text: string
  inputText$ = new Subject<string>();
  private ngUnsubscribe$: Subject<void> = new ReplaySubject<void>(1);

  constructor() { }

  ngOnInit() {
    this.inputText$
      .pipe(
        debounceTime(500),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => this.outputEmitter.emit(this.text))
  }

  change() {
    this.inputText$.next(this.text.trim())
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
