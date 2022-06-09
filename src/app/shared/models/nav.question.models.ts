import {Question} from './question.model';
import {ExamUser} from './examuser.model';

export class NavQuestionModel {
  constructor(
    public examuser?: ExamUser,
    public previous?: Question,
    public current?: Question,
    public next?: Question,
  ) {
  }
}
