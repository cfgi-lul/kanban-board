import { UserUpdateRequest as UserUpdateRequestInterface } from '../requestModels/model/userUpdateRequest';

export class UserUpdateRequest implements UserUpdateRequestInterface {
  displayName?: string;

  constructor(data: UserUpdateRequestInterface) {
    this.displayName = data.displayName;
  }
}
