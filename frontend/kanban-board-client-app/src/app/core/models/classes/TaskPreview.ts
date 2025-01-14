import { TaskPreviewDTO } from '../requestModels/model/taskPreviewDTO';

export class TaskPreview implements TaskPreviewDTO {
  id?: number;
  title?: string;
  constructor(data: TaskPreviewDTO) {
    this.id = data.id;
    this.title = data.title;
  }
}
