export class VerifiedTasksModel {
  constructor(
    public solutionId?: number,
    public taskId?: number,
    public taskName?: string,
    public topicId?: number
  ) {
  }
}
