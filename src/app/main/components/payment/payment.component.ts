import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { NavService } from '../../../shared/services/nav.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(private route: ActivatedRoute, private navService: NavService) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.navService.setUpModel({payment: true}));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
