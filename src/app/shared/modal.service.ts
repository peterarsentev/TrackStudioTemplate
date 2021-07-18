import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { AreYouSureComponent } from './are-you-sure/are-you-sure.component';
import { AddBookMarkComponent } from './add-book-mark/add-book-mark.component';

export enum TypeModals {
  ARE_YOU_SURE,
  ADD_BOOKMARK

}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {
  }

  openDialogWithConfig(type: TypeModals, config: MatDialogConfig) {
    let reference: MatDialogRef<any>;
    switch (type) {
      case TypeModals.ARE_YOU_SURE:
        reference = this.dialog.open(AreYouSureComponent, config);
        break;
      case TypeModals.ADD_BOOKMARK:
        reference = this.dialog.open(AddBookMarkComponent, config);
        break;
      default:
        break;
    }

    return reference.afterClosed().pipe(take(1));
  }

  openDialog(type: TypeModals, data?: any) {
    const config: MatDialogConfig = data ? {...new MatDialogConfig(), data} : new MatDialogConfig();
    return this.openDialogWithConfig(type, config);
  }
}
