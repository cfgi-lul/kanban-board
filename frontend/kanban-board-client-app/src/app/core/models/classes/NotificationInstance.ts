import { NotificationDTO as NotificationDTOInterface } from '../requestModels/model/notificationDTO';
import { UserInstance } from './UserInstance';

export class NotificationInstance implements NotificationDTOInterface {
  id?: number;
  title: string;
  message: string;
  type: string;
  read?: boolean;
  data?: string;
  recipientId?: number;
  senderId?: number;
  taskId?: number;
  boardId?: number;
  recipient?: UserInstance;
  sender?: UserInstance;
  createdAt?: Date;
  readAt?: Date;

  constructor(data: NotificationDTOInterface) {
    this.id = data.id;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type;
    this.read = data.read;
    this.data = data.data;
    this.recipientId = data.recipientId;
    this.senderId = data.senderId;
    this.taskId = data.taskId;
    this.boardId = data.boardId;
    this.recipient = data.recipient
      ? new UserInstance(data.recipient)
      : undefined;
    this.sender = data.sender ? new UserInstance(data.sender) : undefined;
    this.createdAt = data.createdAt;
    this.readAt = data.readAt;
  }
}
