import { UserDTO } from '../requestModels/model/userDTO';

export class User implements UserDTO {
  id?: number;
  username?: string;
  name?: string; // Legacy field for backward compatibility
  displayName?: string; // New field for display purposes
  roles?: string[];
  avatarUrl?: string;

  constructor(data: UserDTO) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.displayName = (data as UserDTO & { displayName?: string }).displayName;
    this.roles = data.roles;
    this.avatarUrl = (data as UserDTO & { avatarUrl?: string }).avatarUrl;
  }
}
