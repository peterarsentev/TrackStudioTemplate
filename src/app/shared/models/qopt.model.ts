import { Question } from './question.model';

export class Qopt {

  constructor(
    public id?: number,
    public description?: string,
    public question?: Question,
    public correct?: boolean,
    public pos?: number
  ) {
  }
}
