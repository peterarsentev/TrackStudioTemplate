import { SolutionModels } from './solution.models';
import { TaskCodeModel } from './task.code.models';
import { UserModels } from './user.models';

export class SolutionTaskCodeModels {
  constructor(
    public solution?: SolutionModels,
    public taskcode?: TaskCodeModel,
    public user?: UserModels
  ) {
  }
}
