import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

declare var $;

@Component({
  selector: 'app-redactor',
  templateUrl: './redactor.component.html',
  styleUrls: ['./redactor.component.scss']
})
export class RedactorComponent implements OnInit, OnDestroy {
  @Input() text: string;
  inputText$ = new Subject<string>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  @Input()titleLabel: string;
  @Output() outputEmitter: EventEmitter<string> = new EventEmitter<string>();
  helloButton = function customButton(context) {
    const ui = $.summernote.ui;
    // create button
    const button = ui.button({
      contents: 'Code block',
      tooltip: 'hello',
      click() {
        context.invoke('editor.pasteHTML', '<pre><code class="java">class Main{}</code></pre>');
      }
    });
    return button.render();
  };

  config: any = {
    tooltip: false,
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
      ['misc', ['codeview', 'undo', 'redo']],
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
      ['insert', ['table', 'link', 'hr']],
      ['view', ['fullscreen']],
      ['mybutton', ['hello']],
    ],
    codeviewFilter: true,
    // tslint:disable-next-line:max-line-length
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true,
    buttons: {
      hello: this.helloButton.bind(this)
    }
  };

  constructor() { }

  ngOnInit() {
    this.inputText$
      .pipe(
        debounceTime(500),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(res => this.outputEmitter.emit(this.text));
  }

  change() {
    this.outputEmitter.emit(this.replaceURLWithHTMLLinks(this.text));
    // this.inputText$.next(this.replaceURLWithHTMLLinks(this.text));
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
