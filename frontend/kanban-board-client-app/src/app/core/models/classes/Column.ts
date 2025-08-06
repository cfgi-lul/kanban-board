import { ColumnDTO } from '../requestModels/model/columnDTO';
import { TaskPreviewDTO } from '../requestModels/model/taskPreviewDTO';

export class Column implements ColumnDTO {
  id?: number;
  name: string;
  tasks?: Array<TaskPreviewDTO>;

  constructor(data: ColumnDTO) {
    this.id = data.id;
    this.name = data.name;
    this.tasks = data.tasks;
  }
}
