import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule } from 'ngx-summernote';
import { HendlersComponent } from './components/hendlers/hendlers.component';
import { CommonModule } from '@angular/common';
import { RedactorComponent } from './components/redactor/redactor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '../main/components/comments/comments.component';
import { NavigationComponent } from '../main/components/navigation/navigation.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AlertMessageComponent } from '../main/components/alert-message/alert-message.component';
import { ProgressBarSolutionsComponent } from '../main/components/progress-bar/progress-bar-solutions/progress-bar-solutions.component';
import { ProgressBarViewComponent } from '../main/components/progress-bar/progress-bar-view/progress-bar-view.component';
import { SafeCodePipe } from '../main/safe-code.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { AreYouSureComponent } from './are-you-sure/are-you-sure.component';
import { DiscussionComponent } from '../main/components/discussion/discussion.component';

@NgModule({
  imports: [
    HttpClientModule,
    NgxSummernoteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CodemirrorModule,
    MatDialogModule
  ],
  exports: [
    HttpClientModule,
    NgxSummernoteModule,
    HendlersComponent,
    CommentsComponent,
    RedactorComponent,
    FormsModule,
    NavigationComponent,
    CodemirrorModule,
    AlertMessageComponent,
    ProgressBarSolutionsComponent,
    ProgressBarViewComponent,
    SafeCodePipe,
    MatDialogModule,
    AreYouSureComponent,
    DiscussionComponent,
  ],
  declarations: [
    AlertMessageComponent,
    ProgressBarSolutionsComponent,
    HendlersComponent,
    CommentsComponent,
    RedactorComponent,
    NavigationComponent,
    ProgressBarViewComponent,
    SafeCodePipe,
    AreYouSureComponent,
    DiscussionComponent,
  ],
  entryComponents: [
    AreYouSureComponent
  ]
})
export class SharedModule {

}
