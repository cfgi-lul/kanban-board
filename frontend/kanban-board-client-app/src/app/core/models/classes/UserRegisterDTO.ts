import { UserRegisterDTO as UserRegisterDTOInterface } from '../requestModels/model/userRegisterDTO';

export class UserRegisterDTO implements UserRegisterDTOInterface {
  username: string;
  password: string;
  name: string;

  constructor(data: UserRegisterDTOInterface) {
    this.username = data.username;
    this.password = data.password;
    this.name = data.name;
  }
}
