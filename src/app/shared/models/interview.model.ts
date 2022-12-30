export class InterviewModel {
  constructor(
    public id?: number,
    public typeInterview?: string,
    public submitterId ?: number,
    public submitterName ?: string,
    public title?: string,
    public description?: string,
    public contactBy?: string,
    public approximateDate?: string
  ) {
  }
}
