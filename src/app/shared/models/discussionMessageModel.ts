import { DiscussModel } from './discuss.model';

export class DiscussionMessageModel {
  constructor(
    public name: string,
    public task: string,
    public taskId: number,
    public text: string,
    public time: number,
    public userId: string,
    public subscribed?: boolean,
    public discuss?: DiscussModel,
    public id?: number,
    public parentId?: number,
    public exerciseId?: number,
    public sqlExerciseId?: number,
    public discussId?: number,
    public responses?: DiscussionMessageModel[],
    public editResponse?: boolean
  ) {
  }
}
