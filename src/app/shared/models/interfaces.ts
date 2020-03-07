import { UserModels } from './user.models';

export interface AuthResponse {
  sessionId: string
}
export interface UserResponse {
  user: UserModels
}
