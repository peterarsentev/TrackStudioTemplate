export class NavNode {
  constructor(
    public name?: string,
    public url?: string,
    public topicId?: number,
    public taskCodeId?: number,
    public taskId?: number,
    public exercise?: boolean,
    public discuss?: boolean,
    public payment?: boolean,
    public vacancy?: boolean,
    public task_code?: boolean,
    public solutionId?: string,
  ) {
  }
}
