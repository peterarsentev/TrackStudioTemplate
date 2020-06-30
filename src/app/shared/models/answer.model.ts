import { Question } from './question.model';
import { ExamUser } from './examuser.model';

export class Answer {

  constructor(
    public id?: number,
    public question?: Question,
    public examuser?: ExamUser
  ) {
  }

}
