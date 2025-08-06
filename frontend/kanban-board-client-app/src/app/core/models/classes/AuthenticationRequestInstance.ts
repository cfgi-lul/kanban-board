import { AuthenticationRequest as AuthenticationRequestInterface } from '../requestModels/model/authenticationRequest';

export class AuthenticationRequestInstance
  implements AuthenticationRequestInterface
{
  username: string;
  password: string;

  constructor(data: AuthenticationRequestInterface) {
    this.username = data.username;
    this.password = data.password;
  }
}
