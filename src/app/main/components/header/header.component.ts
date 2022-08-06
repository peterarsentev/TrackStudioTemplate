import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserModels } from '../../../shared/models/user.models';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../../shared/services/nav.service';
import { NavNode } from '../../../shared/models/nav.node';
import { InfoModels } from '../../../shared/models/info.models';
import { DiscussService } from '../../discuss/discuss.service';
import { DiscussSearch } from '../../../shared/models/discuss.search';
import { RatingService } from '../../rating/components/rating.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  notifications = false;
  count: number;
  toggled = false;
  navShow = true;
  message: InfoModels;
  iconComment: boolean;
  searchResult: DiscussSearch;
  @ViewChild('text', {static: false}) searchText;
  position = 0;
  discussCount: { count: number };

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navService: NavService,
    private discussService: DiscussService,
    private ratingService: RatingService,
  ) {}

  ngOnInit() {
    this.iconComment = this.router.url.includes('task-view');
    if (this.router.url === '/') {
      this.navService.setUpModel({...new NavNode()});
    }
    this.navShow = !(this.router.url === '/login'  || this.router.url === '/registration');
    this.userService
      .getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((user) => {
        this.user = user;
        this.notifications = !!this.user.name && this.user.name !== 'Аnonymous';
        if (this.notifications) {
          this.getNotifications(this.user.id);
        }
      });
    this.authService
      .getDefaultProjectId()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});
    this.authService.checkSession()
      .subscribe(res => this.userService.setUpModel(res.user));
    this.showIconComment();
    this.getRowPosition();
    this.getCountOfDiscuss();
  }

  initResize() {
    const wrapper = document.getElementById('wrapper');
    wrapper.addEventListener('mousemove', this.Resize, false);
  }
  Resize(e) {
    const element = document.getElementById('resizable');
    element.style.minWidth = `${e.clientX}px`;
  }
  stopResize(e) {
    const wrapper = document.getElementById('wrapper');
    console.log('dragend');
    const element = document.getElementById('resizable');
    element.style.minWidth = `${e.clientX}px`;
    wrapper.removeEventListener('mousemove', this.Resize, false);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  clearStorage() {
    this.userService.setUpModel({});
    if (this.user.name !== 'Аnonymous') {
      this.authService
        .logOut()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.notifications = false;
        });
    }
  }

  goMain() {
    this.router.navigate(['/'], {});
  }

  getNotifications(id: string) {
    this.messageService
      .getNotifications(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => (this.count = res.total));
  }

  readMessages() {
    this.router.navigate(['/messages']);
  }

  onToggle() {
    this.toggled = !this.toggled;
    const elementById = document.getElementById('resizable');
    if (elementById.classList.contains('hide')) { elementById.classList.remove('hide'); } // delete class from clearStorage func
    elementById.classList.toggle('toggle');
  }

  private skipSideBar() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.navShow = !(this.router.url === '/login'  || this.router.url === '/registration');
      });
  }

  search(value: string) {
    if (this.router.url.startsWith('/discuss')) {
      if (value) {
        this.discussService.search(value)
          .subscribe(res => this.searchResult = res);
      }
      return;
    }
    if (!value) {
      this.router.navigate(['exercise']);
    } else {
      this.router.navigate(['exercise', 'search', `${value}`]);
    }
  }

  getMessage() {
    this.messageService.getAdminMessage()
      .subscribe(res => this.message = res);
    if (!!this.user) {
      this.getNotifications(this.user.id);
    }
  }

  private showIconComment() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.iconComment = this.router.url.includes('task-view');
      });
  }

  goToComments() {
    setTimeout(() => {
      const el = document.querySelector('.comment');
      el.scrollIntoView({behavior: 'smooth', block: 'end'});
    }, 1);
  }

  clearSearch() {
    this.searchResult = undefined;
    this.searchText.nativeElement.value = '';
  }

  private getRowPosition() {
    this.ratingService.getRowPosition()
      .subscribe(res => this.position = res.row);

  }

  goToListOfDiscuss() {
    this.router.navigate(['discuss', 'notifications']);
  }

  private getCountOfDiscuss() {
    this.messageService.getCountOfDiscuss()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => this.discussCount = res);
  }
}
