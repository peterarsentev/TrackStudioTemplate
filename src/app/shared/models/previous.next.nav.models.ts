import {TaskModel} from './task.model';

export class PreviousNextNavModels {
  constructor(
    public nextId?: TaskModel,
    public previousId?: TaskModel
  ) {
  }
}
