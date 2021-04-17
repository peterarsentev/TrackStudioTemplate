import { UserModels } from './user.models';
import { TaskModel } from './task.model';
import { StatusModel } from './status.model';

export class ResponseModel {
  public handler?: UserModels;
  public task?: TaskModel;
  public status?: StatusModel;
}
