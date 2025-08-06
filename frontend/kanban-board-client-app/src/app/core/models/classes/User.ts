import { User as UserInterface } from '../requestModels/model/user';
import { Role } from './Role';

export class User implements UserInterface {
  id?: number;
  username?: string;
  name?: string;
  displayName?: string;
  password?: string;
  roles?: Array<Role>;

  constructor(data: UserInterface) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.displayName = data.displayName;
    this.password = data.password;
    this.roles = data.roles;
  }
}
