import { DiscussModel } from './discuss.model';

export class DiscussSearch {
  constructor(
    public discuss?: DiscussModel[],
    public exercises?: DiscussModel[],
    public tasks?: DiscussModel[],
  ) {
  }
}
