export class ProgressModel {

  constructor(
    public progress?: number,
    public count?: number,
    public topicId?: number,
    public solved?: number,
    public currentAnswers?: number,
    public totalQuestions?: number,
  ) {
  }
}
