import { WisherModel } from './wisher.model';

export class InterviewModel {

  constructor(
    public id?: number,
    public typeInterview?: string,
    public submitterId ?: number,
    public submitterName ?: string,
    public title?: string,
    public description?: string,
    public contactBy?: string,
    public approximateDate?: string,
    public type?: string,
    public wishers?: WisherModel[],
    public status?: string,
    public submitterScore?: number,
    public wisherScore?: number,
    public feedbackToSubmitter?: string,
    public feedbackToWisher?: string,

  ) {
  }
}
