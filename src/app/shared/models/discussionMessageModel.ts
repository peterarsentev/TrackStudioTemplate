import { DiscussModel } from './discuss.model';

export class DiscussionMessageModel {
  constructor(
    public name: string,
    public task: string,
    public text: string,
    public time: number,
    public userId: string,
    public subscribed?: boolean,
    public discuss?: DiscussModel
  ) {
  }
}
