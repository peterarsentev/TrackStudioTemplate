import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  modalRef: MatDialogRef<LoginComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openLoginModal() {
  this.modalRef = this.dialog.open(LoginComponent);
  this.modalRef.afterClosed()
    .subscribe(res => console.log(res))
  }
}
