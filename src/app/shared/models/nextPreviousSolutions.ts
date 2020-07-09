import { NavNode } from './nav.node';
import { TaskCodeModel } from './task.code.models';

export class NextPreviousSolutions {

  constructor(
    public next?: TaskCodeModel,
    public previous?: TaskCodeModel
  ) {
  }
}
