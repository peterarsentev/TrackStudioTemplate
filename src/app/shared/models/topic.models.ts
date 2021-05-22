import { LevelModels } from './level.models';
import { CategoryModels } from './category.models';

export class TopicModels {
  constructor(
    public id?: string,
    public name?: string,
    public level?: LevelModels,
    public category?: CategoryModels
  ) {
  }
}
