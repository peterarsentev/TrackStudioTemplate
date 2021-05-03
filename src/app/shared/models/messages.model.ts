import { UserModels } from './user.models';
import { MessageModel } from './message.model';
import { TaskStatus } from './task.topic.model';

export class MessagesModel {
  constructor(
    public submitter?: UserModels,
    public handler?: UserModels,
    public message?: MessageModel,
    public status?: TaskStatus

  ) {
  }
}
