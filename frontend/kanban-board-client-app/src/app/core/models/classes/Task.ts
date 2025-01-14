import { CommentDTO } from '../requestModels/model/commentDTO';
import { TaskDTO } from '../requestModels/model/taskDTO';

export class Task implements TaskDTO {
  id?: number;
  title?: string;
  description?: string;
  comments?: CommentDTO[];
  constructor(data: TaskDTO) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.comments = data.comments;
  }
}
