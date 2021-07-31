import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService, TypeModals } from '../../modal.service';
import { take, takeUntil } from 'rxjs/operators';
import { MessageService } from '../../services/message.service';
import { Subject } from 'rxjs';
import { BookmarksService } from '../../services/bookmarks.service';

@Component({
  selector: 'app-book-mark-star',
  templateUrl: './book-mark-star.component.html',
  styleUrls: ['./book-mark-star.component.scss']
})
export class BookMarkStarComponent implements OnInit, OnDestroy {

  @Input() name: string;
  url: string;
  private ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(private modalService: ModalService,
              private bookmarksService: BookmarksService,
              private messageService: MessageService) {
  }

  ngOnInit() {
  }

  addInBookMarks() {
    this.url = window.location.href;
    this.modalService.openDialog(TypeModals.ADD_BOOKMARK, {name: this.name, url: this.url})
        .pipe(take(1))
        .subscribe(res => {
          if (res) {
            this.messageService.addToFavorite(res)
                .pipe(takeUntil(this.ngUnsubscribe$))
                .subscribe(() => this.bookmarksService.setUpModel(true));
          }
        });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
