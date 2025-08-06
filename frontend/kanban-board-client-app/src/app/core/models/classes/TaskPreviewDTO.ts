import { TaskPreviewDTO as TaskPreviewDTOInterface } from '../requestModels/model/taskPreviewDTO';

export class TaskPreviewDTO implements TaskPreviewDTOInterface {
  id?: number;
  title?: string;

  constructor(data: TaskPreviewDTOInterface) {
    this.id = data.id;
    this.title = data.title;
  }
}
