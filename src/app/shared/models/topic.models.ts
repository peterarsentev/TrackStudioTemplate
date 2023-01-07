import { LevelModels } from './level.models';
import { CategoryModels } from './category.models';
import { ProgressModel } from './progress.model';

export class TopicModels {
  constructor(
    public id?: string,
    public name?: string,
    public level?: LevelModels,
    public category?: CategoryModels,
    public progress?: ProgressModel,
  ) {
  }
}
