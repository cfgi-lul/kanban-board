import { RoleDTO as RoleDTOInterface } from '../requestModels/model/roleDTO';

export class RoleInstance implements RoleDTOInterface {
  id?: number;
  name: string;

  constructor(data: RoleDTOInterface) {
    this.id = data.id;
    this.name = data.name;
  }
}
