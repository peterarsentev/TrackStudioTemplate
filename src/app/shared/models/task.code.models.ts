export class TaskCodeModel {
  constructor(
    public id?: string,
    public topicId?: string,
    public name?: string,
    public description?: string,
    public className?: string,
    public classCode?: string,
    public testName?: string,
    public testCode?: string,
    public status?: number,
    public solutionId?: number,
    public explanation?: string,
    public complexity?: string,

    //solution
    public  taskCodeId?: number,
    public  tsUserId?: string,
    public  code?: string,
    public  statusId?: number,
    public  created?: string,
    public  updated?: string,
  ) {
  }
}
