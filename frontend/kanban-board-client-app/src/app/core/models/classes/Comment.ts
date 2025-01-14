import { CommentDTO } from '../requestModels/model/commentDTO';
import { User } from './User';

export class Comment implements CommentDTO {
  id?: number;
  content?: string;
  createdAt?: Date;
  author?: User;
  taskId?: number;

  constructor(data: CommentDTO) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.author = new User(data.author);
    this.taskId = data.taskId;
  }
}
