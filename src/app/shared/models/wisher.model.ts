import { UserScoreModel } from './user.score.model';

export class WisherModel {
  constructor(
    public id?: number ,
    public interviewId?: number,
    public userId?: number,
    public contactBy?: string,
    public approve?: boolean,
    public name?: string,
    public userScore?: UserScoreModel
  ) {
  }
}
