import { SystemAnalytics as SystemAnalyticsInterface } from '../requestModels/model/systemAnalytics';

export class SystemAnalyticsInstance implements SystemAnalyticsInterface {
  totalUsers?: number;
  activeUsers?: number;
  totalBoards?: number;
  totalTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  totalComments?: number;
  averageCompletionTime?: number;
  statusDistribution?: { [key: string]: number };
  priorityDistribution?: { [key: string]: number };

  constructor(data: SystemAnalyticsInterface) {
    this.totalUsers = data.totalUsers;
    this.activeUsers = data.activeUsers;
    this.totalBoards = data.totalBoards;
    this.totalTasks = data.totalTasks;
    this.completedTasks = data.completedTasks;
    this.overdueTasks = data.overdueTasks;
    this.totalComments = data.totalComments;
    this.averageCompletionTime = data.averageCompletionTime;
    this.statusDistribution = data.statusDistribution;
    this.priorityDistribution = data.priorityDistribution;
  }
}
