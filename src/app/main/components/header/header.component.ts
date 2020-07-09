import { Component, OnDestroy, OnInit, } from "@angular/core";
import { UserService } from "../../../shared/services/user.service";
import { Subject } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { UserModels } from "../../../shared/models/user.models";
import { AuthService } from "../../../shared/services/auth.service";
import { MessageService } from "../../../shared/services/message.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";


@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  notifications = false;
  count: number;
  toggled = false;
  navShow = true;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.navShow = !(this.router.url == "/login"  || this.router.url == '/registration');
    this.userService
      .getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((user) => {
        this.user = user;
        this.notifications = !!this.user.name && this.user.name !== "Аnonymous";
        if (this.notifications) {
          this.getNotifications(this.user.id);
          this.executor(this.user.id);
        }
      });
    this.authService
      .getDefaultProjectId()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});
    this.skipSideBar();
  }

  initResize() {
    const wrapper = document.getElementById('wrapper');
    wrapper.addEventListener('mousemove', this.Resize, false);
  }
  Resize(e){
    const element = document.getElementById('resizable');
    element.style.minWidth =`${e.clientX}px`;
  }
  stopResize(e) {
    const wrapper = document.getElementById('wrapper');
    console.log('dragend');
    const element = document.getElementById('resizable');
    element.style.minWidth =`${e.clientX}px`;
    wrapper.removeEventListener('mousemove', this.Resize, false);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  clearStorage() {
    this.userService.setUpModel({});
    if (this.user.name !== "Аnonymous") {
      this.authService
        .logOut()
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((res) => {
          this.notifications = false;
        });
    }
  }

  goMain() {
    this.authService
      .login()
      .pipe(
        switchMap(() => this.authService.getDefaultProjectId()),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(() => this.router.navigate(["/"], {}));
  }

  getNotifications(id: string) {
    this.messageService
      .getNotifications(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => (this.count = res.total));
  }

  readMessages() {
    this.router.navigate(["/messages"]);
  }

  onToggle() {
    const elementById = document.getElementById("resizable");
    if(elementById.classList.contains("hide")) elementById.classList.remove("hide"); //delete class from clearStorage func
    elementById.classList.toggle("toggle");

  }

  private skipSideBar() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.navShow = !(this.router.url == "/login"  || this.router.url == '/registration')
      });
  }

  private executor(id: string) {
    setInterval(() => {
      this.getNotifications(this.user.id);
    }, 30000);
  }
}
