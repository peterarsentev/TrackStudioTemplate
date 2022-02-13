import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from '../../../../shared/services/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-discussion',
  templateUrl: './create-discussion.component.html',
  styleUrls: ['./create-discussion.component.scss']
})
export class CreateDiscussionComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private unsubscribe$ = new Subject();
  constructor(private router: Router,
              private messageService: MessageService) { }

  ngOnInit() {}

  save(data: { name: string, description: string}) {
    this.messageService.create(data.name, data.description)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.router.navigate(['discuss', `${res.id}`]));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
