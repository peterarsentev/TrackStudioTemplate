export class ButtonCommentModel {
  constructor(
    public preferences?: string,
    public name?: string,
    public action?: string,
    public description?: string,
    public id?: string,
    public workflowId?: string,
  ) {
  }
}
