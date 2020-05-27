import { RateModel } from './rate.model';

export class ResponeRatingModel {
  constructor(
    public rate: RateModel,
    public vote?: string,
  ) {
  }
}
