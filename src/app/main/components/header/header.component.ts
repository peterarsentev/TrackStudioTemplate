import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserModels } from '../../../shared/models/user.models';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<void> = new Subject<void>();
  user: UserModels;
  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(user => {
        this.user = user
      });
    this.authService.getDefaultProjectId()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {});
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  clearStorage() {
    if (this.user.name !== 'Аnonymous') {
     this.authService.logOut()
       .pipe(takeUntil(this.ngUnsubscribe$))
       .subscribe(res => {
         this.userService.setUpModel({})
         console.log(res)
       });
    }
  }
}
