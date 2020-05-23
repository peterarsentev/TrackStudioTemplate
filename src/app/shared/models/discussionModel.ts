export class DiscussionModel {
  constructor(
    public name: string,
    public task: string,
    public text: string,
    public time: number,
    public userId: string
  ) {
  }
}
