export class TaskModel {
  constructor(
    public closedate?: number,
    public messageCount?: number,
    public string?: string,
    public description?: string,
    public shortname?: string,
    public parentId?: string,
    public number?: string,
    public abudget?: number,
    public nameCutted?: string,
    public updatedate?: number,
    public statusId?: string,
    public onSight?: boolean,
    public submitterId?: string,
    public name?: string,
    public id?: string,
    public submitdate?: number,
    public handlerUserId?: string,
    public hasAttachments?: boolean,
    public deadline?: number,
    public categoryId?: string,
    public workflowId?: string,
    public budget?: number,
    public childrenCount?: number,

  public handler?: string,
  public task?: string,
  public status?: string
  ) {
  }
}
