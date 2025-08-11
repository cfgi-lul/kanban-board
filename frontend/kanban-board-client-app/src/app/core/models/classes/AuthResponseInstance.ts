import { AuthResponseDTO as AuthResponseDTOInterface } from '../requestModels/model/authResponseDTO';
import { UserInstance } from './UserInstance';

export class AuthResponseInstance implements AuthResponseDTOInterface {
  token?: string;
  user?: UserInstance;

  constructor(data: AuthResponseDTOInterface) {
    this.token = data.token;
    this.user = data.user ? new UserInstance(data.user) : undefined;
  }
} 