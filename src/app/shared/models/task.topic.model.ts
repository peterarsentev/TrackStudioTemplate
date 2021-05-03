import { UserEduModels } from './userEduModels';

export class TaskTopicModel {
  constructor(
    public task?: TaskModel,
    public handler?: UserEduModels,
    public status?: TaskStatus,
    public solution?: Solution,
    public nextId?: number,
    public previousId?: number
  ) {
  }
}
class TaskModel {
  constructor(
    public id?: number,
    public taskId?: number,
    public name?: string,
    public topicId?: number,
    public number?: string,
    public description?: string,
    public taskName?: string,
    public taskNumber?: number
  ) {
  }
}

export class TaskStatus {
  constructor(
    public color?: string,
    public finish?: boolean,
    public id?: number,
    public start?: boolean,
    public statusName?: string
  ) {
  }
}
class Solution {
  constructor(
    public authorId: number,
    public createdTime: number,
    public handlerId: number,
    public id: number,
    public statusId: number,
    public submitterId: number,
    public taskId: number,
    public updatedTime: number
  ) {
  }
}
