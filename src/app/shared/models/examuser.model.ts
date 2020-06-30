import { ExamModels } from './exam.models';
import { Timestamp } from 'rxjs';

export class ExamUser {
  constructor(
    public id?: number,
    public exam?: ExamModels,
    public result?: number,
    public start?: number,
    public finish?: number,
    public userid?: number,
    public total?: number
  ) {}
}

// private int id;
//
// private Exam exam;
//
// private int result;
//
// private Calendar start;
//
// private Calendar finish;
//
// private int userId;
//
// private int total;
