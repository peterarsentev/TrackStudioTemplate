import { ExamModels } from './exam.models';
import { Timestamp } from 'rxjs';

export class ExamUser {
  constructor(
    public id?: number,
    public exam?: ExamModels,
    public result?: number,
    public start?: number,
    public finish?: number,
    public userid?: string,
    public total?: number
  ) {}
}
