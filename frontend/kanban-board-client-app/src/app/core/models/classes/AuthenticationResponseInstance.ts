import { AuthenticationResponse as AuthenticationResponseInterface } from '../requestModels/model/authenticationResponse';

export class AuthenticationResponseInstance
  implements AuthenticationResponseInterface
{
  token?: string;

  constructor(data: AuthenticationResponseInterface) {
    this.token = data.token;
  }
}
