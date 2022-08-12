import { UserModels } from './user.models';
import { TopicModels } from './topic.models';

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
    public sqlExerciseId?: number,
    public nextId?: number,
    public previousId?: number,
    public topic?: TopicModels,
    public taskCode?: string,
    public initScript?: string,
    public scheme?: string,
) {
  }
}
