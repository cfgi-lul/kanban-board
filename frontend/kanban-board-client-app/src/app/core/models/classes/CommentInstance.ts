import { CommentDTO as CommentDTOInterface } from '../requestModels/model/commentDTO';
import { UserInstance } from './UserInstance';

export class CommentInstance implements CommentDTOInterface {
  id?: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  editedAt?: Date;
  mentions?: string;
  edited?: boolean;
  author?: UserInstance;
  taskId?: number;

  constructor(data: CommentDTOInterface) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.editedAt = data.editedAt;
    this.mentions = data.mentions;
    this.edited = data.edited;
    this.author = data.author ? new UserInstance(data.author) : undefined;
    this.taskId = data.taskId;
  }
}
