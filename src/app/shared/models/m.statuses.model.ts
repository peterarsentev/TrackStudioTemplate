export class MStatusesModel {
  constructor(
    public groupHandlerAllowed?: boolean,
    public preferences?: string,
    public icon?: string,
    public name?: string,
    public action?: string,
    public description?: string,
    public id?: string,
    public  workflowId?: string,
    public taskId?: string,
    public handlerRequired?: boolean,
    public budget?: string,
  ) {
  }
}
