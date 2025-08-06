import { ColumnDTO as ColumnDTOInterface } from '../requestModels/model/columnDTO';
import { TaskPreviewDTO } from './TaskPreviewDTO';

export class ColumnDTO implements ColumnDTOInterface {
  id?: number;
  name: string;
  tasks?: Array<TaskPreviewDTO>;

  constructor(data: ColumnDTOInterface) {
    this.id = data.id;
    this.name = data.name;
    this.tasks = data.tasks;
  }
}
