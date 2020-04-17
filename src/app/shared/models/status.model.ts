export class StatusModel {

  constructor(
    public color?: string,
    public name?: string,
    public start?: boolean,
    public finish?: boolean,
    public id?: string,
    public workflowId?: string
  ) {
  }
}
