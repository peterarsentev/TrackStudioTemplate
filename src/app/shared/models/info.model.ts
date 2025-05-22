import {UserModels} from './user.models';
import {SolutionModels} from './solution.models';

export class InfoModel {
  constructor(
   public user?: UserModels,
   public solution?: SolutionModels
  ) {
  }
}
