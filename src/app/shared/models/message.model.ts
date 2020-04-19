export class MessageModel {
  constructor(
    public submitterId?: string,
    public mstatusId?: string,
    public hrs?: number,
    public description?: string,
    public time?: number,
    public id?: string,
    public handlerUserId?: string,
    public  deadline?: number,
    public  taskId?: string,
    public budget?: number
  ) {
  }
}
