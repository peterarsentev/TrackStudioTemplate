import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-log',
  templateUrl: './show-log.component.html',
  styleUrls: ['./show-log.component.scss']
})
export class ShowLogComponent implements OnInit {
    log: string;
  constructor(public dialogRef: MatDialogRef<ShowLogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.log = data;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
