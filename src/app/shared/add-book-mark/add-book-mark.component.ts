import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-book-mark',
  templateUrl: './add-book-mark.component.html',
  styleUrls: ['./add-book-mark.component.scss']
})
export class AddBookMarkComponent implements OnInit {

  url;
  name;

  constructor(public dialogRef: MatDialogRef<AddBookMarkComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.url = data.url;
    this.name = data.name;
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({ name: this.name, link: this.url });
  }
}
