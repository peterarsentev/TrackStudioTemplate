import { UserModels } from './user.models';

export class AuthResponse {
  constructor(
    public sessionId?: string,
    public user?: UserModels
  ) {
  }


}
export interface UserResponse {
  user: UserModels
}
