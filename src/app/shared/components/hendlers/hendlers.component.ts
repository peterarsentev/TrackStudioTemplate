import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserModels } from '../../models/user.models';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hendlers',
  templateUrl: './hendlers.component.html',
  styleUrls: ['./hendlers.component.scss']
})
export class HendlersComponent implements OnInit, OnDestroy {

  @Input()handlers: UserModels[];
  @Input()searchHandlers: UserModels[];
  @Output()selected: EventEmitter<UserModels> = new EventEmitter<UserModels>();
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  userName = 'Петр Арсентьев';
  inputName$ = new Subject<string>();

  constructor() { }

  ngOnInit() {
    this.subscribeOnSearch();
  }

  select(handler: UserModels) {
    this.userName = handler.name;
    this.selected.emit(handler);
  }

  search(elem) {
    this.inputName$.next(elem.target.value)
  }

  private subscribeOnSearch() {
    this.inputName$
      .pipe(
        debounceTime(300),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(res => {
        if (!res) {
          this.searchHandlers = this.handlers;
        } else {
          this.searchHandlers = this.handlers.filter(user => user.name.toLowerCase().includes(res.toLowerCase()));
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
