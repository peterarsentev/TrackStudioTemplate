import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public dialog: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialog.close()
  }

  login() {
    this.dialog.close()
  }
}
