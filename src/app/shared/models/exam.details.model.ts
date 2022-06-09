import { ExamUser } from './examuser.model';
import {ExamModels} from './exam.models';

export class ExamDetailsModel {

  constructor(
    public exam: ExamModels,
    public examuser: ExamUser,
    public questions: number
  ) {
  }

}
