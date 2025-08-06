import { UserDTO as UserDTOInterface } from '../requestModels/model/userDTO';

export class UserDTO implements UserDTOInterface {
  id?: number;
  username?: string;
  name?: string;

  constructor(data: UserDTOInterface) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
  }
}
