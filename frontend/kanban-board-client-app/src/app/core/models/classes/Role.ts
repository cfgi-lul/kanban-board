import { Role as RoleInterface } from '../requestModels/model/role';

export class Role implements RoleInterface {
  id?: number;
  name?: string;

  constructor(data: RoleInterface) {
    this.id = data.id;
    this.name = data.name;
  }
}
