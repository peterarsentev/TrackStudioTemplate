import { UserModels } from './user.models';

export class DiscussModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public created?: number,
    public updated?: number,
    public submitterId?: number,
    public taskId?: number,
    public exerciseId?: number,
    public submitter?: UserModels,
    public subscribed?: boolean,
    public sqlExerciseId?: number
) {
  }
}
