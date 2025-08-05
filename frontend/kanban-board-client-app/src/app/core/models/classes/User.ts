import { UserDTO } from '../requestModels/model/userDTO';

export class User implements UserDTO {
  id?: number;
  username?: string;
  name?: string;
  roles?: string[];

  constructor(data: UserDTO) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.roles = data.roles;
  }
}
