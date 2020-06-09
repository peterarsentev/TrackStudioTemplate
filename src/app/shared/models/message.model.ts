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
    public  tsId?: string,
    public budget?: number,
    public number?: string,
    public text?: string,
    public userId?: string
  ) {
  }
}
