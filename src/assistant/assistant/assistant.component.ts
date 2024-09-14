import { Component, OnDestroy, OnInit } from '@angular/core';
import { pluck, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AssistantService } from './assistant.service';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  question = '';
  answer = '';
  inProgress = false;

  constructor(private route: ActivatedRoute, private assistantService: AssistantService) { }

  ngOnInit() {
    this.question = localStorage.getItem('assistant');
    this.inProgress = true;
    this.assistantService.getAnswer(this.question)
      .subscribe(res => {
        this.answer = res.answer;
        this.inProgress = false;
      });

  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
