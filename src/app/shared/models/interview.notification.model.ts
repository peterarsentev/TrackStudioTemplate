export class InterviewNotificationModel {
  constructor(
    public id: number,
    public userId: number,
    public body: string,
    public wasRead: boolean
  ) {
  }
}
