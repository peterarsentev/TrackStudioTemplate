import { SolutionModels } from './solution.models';
import { TaskCodeModel } from './task.code.models';

export class SolutionTaskCodeModels {
  constructor(
    public solution?: SolutionModels,
    public taskcode?: TaskCodeModel
  ) {
  }
}
