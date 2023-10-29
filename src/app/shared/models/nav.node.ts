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
    public company?: boolean,
    public task_code?: boolean,
    public sqlExercise?: boolean,
    public solutionId?: string,
    public authorName?: string,
    public solutions?: boolean,
    public status?: string,
    public userId?: string,
    public exams?: boolean,
    public interview?: boolean,
    public rating?: boolean,
    public updates?: boolean,
    public levelId?: number,
    public categoryId?: number
  ) {
  }
}
