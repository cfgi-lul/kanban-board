import { ColumnDTO as ColumnDTOInterface } from "../requestModels/model/columnDTO";
import { TaskInstance } from "./TaskInstance";

export class ColumnInstance implements ColumnDTOInterface {
  id?: number;
  name: string;
  orderIndex?: number;
  color?: string;
  taskLimit?: number;
  createdAt?: Date;
  updatedAt?: Date;
  tasks?: Array<TaskInstance>;

  constructor(data: ColumnDTOInterface) {
    this.id = data.id;
    this.name = data.name;
    this.orderIndex = data.orderIndex;
    this.color = data.color;
    this.taskLimit = data.taskLimit;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.tasks = data.tasks
      ? data.tasks.map((task) => new TaskInstance(task))
      : undefined;
  }
}
