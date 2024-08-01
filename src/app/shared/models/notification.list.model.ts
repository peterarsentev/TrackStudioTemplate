import { UserModels } from './user.models';

export class NotificationListModel {
  constructor(
    public body?: string,
    public discussId?: number,
    public id?: number,
    public submitter?: UserModels,
    public submitterId?: number,
    public userId?: number,
    public time?: number,
    public messageId?: number
  ) {
  }
}
