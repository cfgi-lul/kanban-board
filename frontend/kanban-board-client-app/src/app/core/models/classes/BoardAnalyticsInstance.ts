import { BoardAnalytics as BoardAnalyticsInterface } from '../requestModels/model/boardAnalytics';

export class BoardAnalyticsInstance implements BoardAnalyticsInterface {
  totalTasks?: number;
  totalColumns?: number;
  totalUsers?: number;
  createdAt?: Date;

  constructor(data: BoardAnalyticsInterface) {
    this.totalTasks = data.totalTasks;
    this.totalColumns = data.totalColumns;
    this.totalUsers = data.totalUsers;
    this.createdAt = data.createdAt;
  }
}
