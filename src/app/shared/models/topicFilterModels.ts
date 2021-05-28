import { TopicFilter } from './topickFilter';

export class TopicFilterModels {
  constructor(
    public categories?: TopicFilter,
    public levels?: TopicFilter
  ) {
  }
}
