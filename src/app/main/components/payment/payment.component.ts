import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NavService } from '../../../shared/services/nav.service';
import { UserService } from '../../../shared/services/user.service';
import { UserModels } from '../../../shared/models/user.models';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();
  user: UserModels;

  constructor(private route: ActivatedRoute, private userService: UserService,
              private navService: NavService) { }

  ngOnInit() {
    this.userService.getModel()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => this.user = res);
    this.route.params.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.navService.setUpModel({payment: true}));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
