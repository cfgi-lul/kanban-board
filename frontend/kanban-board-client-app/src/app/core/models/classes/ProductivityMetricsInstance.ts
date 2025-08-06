import { ProductivityMetrics as ProductivityMetricsInterface } from '../requestModels/model/productivityMetrics';

export class ProductivityMetricsInstance
  implements ProductivityMetricsInterface
{
  boardId?: number;
  fromDate?: Date;
  toDate?: Date;
  tasksCreated?: number;
  tasksCompleted?: number;
  completionRate?: number;
  averageTaskDuration?: number;

  constructor(data: ProductivityMetricsInterface) {
    this.boardId = data.boardId;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.tasksCreated = data.tasksCreated;
    this.tasksCompleted = data.tasksCompleted;
    this.completionRate = data.completionRate;
    this.averageTaskDuration = data.averageTaskDuration;
  }
}
