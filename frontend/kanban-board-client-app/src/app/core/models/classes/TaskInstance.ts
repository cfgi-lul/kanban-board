import { TaskDTO as TaskDTOInterface } from '../requestModels/model/taskDTO';
import { UserInstance } from './UserInstance';
import { CommentInstance } from './CommentInstance';
import { AttachmentInstance } from './AttachmentInstance';
import { LabelInstance } from './LabelInstance';

export class TaskInstance implements TaskDTOInterface {
  id?: number;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  comments?: Array<CommentInstance>;
  attachments?: Array<AttachmentInstance>;
  labels?: Array<LabelInstance>;
  createdBy?: UserInstance;
  position?: number;
  assignee?: UserInstance;

  constructor(data: TaskDTOInterface) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.status = data.status;
    this.dueDate = data.dueDate;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.position = data.position;
    this.comments = data.comments
      ? data.comments.map(comment => new CommentInstance(comment))
      : undefined;
    this.attachments = data.attachments
      ? data.attachments.map(attachment => new AttachmentInstance(attachment))
      : undefined;
    this.labels = data.labels
      ? data.labels.map(label => new LabelInstance(label))
      : undefined;
    this.createdBy = data.createdBy
      ? new UserInstance(data.createdBy)
      : undefined;
    this.assignee = data.assignee ? new UserInstance(data.assignee) : undefined;
  }
}
