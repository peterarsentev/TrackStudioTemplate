import { UserModels } from './user.models';
import { UserEduModules } from './user.edu.modules';

export class AuthResponse {
  constructor(
    public sessionId?: string,
    public user?: UserEduModules
  ) {
  }


}
export interface UserResponse {
  user: UserModels
}
