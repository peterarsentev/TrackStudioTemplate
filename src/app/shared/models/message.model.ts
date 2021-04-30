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
    public  taskId?: string,
    public budget?: number,
    public number?: string,
    public text?: string,
    public userId?: string,
    public topicId?: number,

    public handlerId?: number,
    public solutionId?: number,
    public timeMils?: number
  ) {
  }
}
