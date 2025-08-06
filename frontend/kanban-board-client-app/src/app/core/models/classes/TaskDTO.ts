import { TaskDTO as TaskDTOInterface } from '../requestModels/model/taskDTO';
import { UserDTO } from './UserDTO';
import { CommentDTO } from './CommentDTO';

export class TaskDTO implements TaskDTOInterface {
  id?: number;
  title: string;
  description?: string;
  comments?: Array<CommentDTO>;
  createdBy?: UserDTO;
  assignee?: UserDTO;

  constructor(data: TaskDTOInterface) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.comments = data.comments;
    this.createdBy = data.createdBy;
    this.assignee = data.assignee;
  }
}
