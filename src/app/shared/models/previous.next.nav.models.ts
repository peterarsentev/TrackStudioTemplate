import {TaskModel} from './task.model';

export class PreviousNextNavModels {
  constructor(
    public next?: TaskModel,
    public previous?: TaskModel
  ) {
  }
}
