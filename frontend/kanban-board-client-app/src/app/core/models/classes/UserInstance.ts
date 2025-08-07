import { UserDTO as UserDTOInterface } from '../requestModels/model/userDTO';
import { RoleInstance } from './RoleInstance';

export class UserInstance implements UserDTOInterface {
  id?: number;
  username: string;
  password: string;
  displayName: string;
  email?: string;
  avatar?: string;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  enabled?: boolean;
  name?: string;
  roles?: Array<RoleInstance>;

  constructor(data: UserDTOInterface) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.displayName = data.displayName;
    this.email = data.email;
    this.avatar = data.avatar;
    this.lastLoginAt = data.lastLoginAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.enabled = data.enabled;
    this.name = data.name;
    this.roles = data.roles
      ? data.roles.map(role => new RoleInstance(role))
      : undefined;
  }
}
