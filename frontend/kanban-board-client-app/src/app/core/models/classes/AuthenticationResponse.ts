import { AuthenticationResponse as AuthenticationResponseInterface } from '../requestModels/model/authenticationResponse';

export class AuthenticationResponse implements AuthenticationResponseInterface {
  token?: string;

  constructor(data: AuthenticationResponseInterface) {
    this.token = data.token;
  }
}
