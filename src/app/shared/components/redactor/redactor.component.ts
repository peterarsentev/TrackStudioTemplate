import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
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
      ['customButtons', ['testBtn']],
      ['view', ['fullscreen', 'codeview', 'help']],
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true
  };

  @Input() text: string;
  inputText$ = new Subject<string>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor() { }

  ngOnInit() {
    this.inputText$
      .pipe(
        debounceTime(500),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => this.outputEmitter.emit(this.text));
  }

  change() {
    this.inputText$.next(this.replaceURLWithHTMLLinks(this.text));
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  replaceURLWithHTMLLinks(text) {
    // tslint:disable-next-line:max-line-length
    const exp = /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;
    return  text.replace(exp, '<a href=\'$1\'>$1</a>');
  }
}
