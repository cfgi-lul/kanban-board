import { CommentDTO as CommentDTOInterface } from '../requestModels/model/commentDTO';
import { UserDTO } from './UserDTO';

export class CommentDTO implements CommentDTOInterface {
  id?: number;
  content: string;
  createdAt?: Date;
  author?: UserDTO;
  taskId?: number;

  constructor(data: CommentDTOInterface) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.author = data.author;
    this.taskId = data.taskId;
  }
}
