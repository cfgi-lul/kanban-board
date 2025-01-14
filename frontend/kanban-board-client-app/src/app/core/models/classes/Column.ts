import { ColumnDTO } from '../requestModels/model/columnDTO';
import { TaskPreview } from './TaskPreview';

export class Column implements ColumnDTO {
  id?: number;
  name?: string;
  tasks?: TaskPreview[];
  constructor(data: ColumnDTO) {
    this.id = data.id;
    this.name = data.name;
    this.tasks = data.tasks;
  }
}
