import { RatingModel } from './rating.model';

export class RatingResponse {
  constructor(
    public hasNext: boolean,
    public ratings: RatingModel[]
  ) {
  }
}
