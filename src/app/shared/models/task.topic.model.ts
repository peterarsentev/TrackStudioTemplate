import { UserEduModels } from './userEduModels';

export class TaskTopicModel {
  constructor(
    public task?: TaskModel,
    public handler?: UserEduModels,
    public status?: TaskStatus
  ) {
  }
}
class TaskModel {
  constructor(
    public id?: number,
    public name?: string,
    public topicId?: number,
    public number?: string,
    public description?: string
  ) {
  }
}

class TaskStatus {
  constructor(
    public color?: string,
    public finish?: boolean,
    public id?: number,
    public start?: boolean,
    public statusName?: string
  ) {
  }
}
