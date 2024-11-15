export class InterviewQuestionModels {
  constructor(
    public id?: number,
    public title?: string,
    public position?: number,
    public description?: string,
    public explanation?: string,
    public topicId?: number,
    public level?: string,
    public views?: number,
    public status?: number
  ) {
  }
}
