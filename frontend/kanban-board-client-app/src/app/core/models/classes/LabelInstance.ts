import { LabelDTO as LabelDTOInterface } from "../requestModels/model/labelDTO";

export class LabelInstance implements LabelDTOInterface {
  id?: number;
  name: string;
  color: string;
  description?: string;
  boardId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: LabelDTOInterface) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.description = data.description;
    this.boardId = data.boardId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
