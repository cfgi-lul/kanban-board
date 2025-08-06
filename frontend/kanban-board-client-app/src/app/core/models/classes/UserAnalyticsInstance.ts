import { UserAnalytics as UserAnalyticsInterface } from '../requestModels/model/userAnalytics';

export class UserAnalyticsInstance implements UserAnalyticsInterface {
  userId?: number;
  username?: string;
  displayName?: string;
  assignedTasks?: number;
  createdTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  completionRate?: number;
  statusDistribution?: { [key: string]: number };
  priorityDistribution?: { [key: string]: number };

  constructor(data: UserAnalyticsInterface) {
    this.userId = data.userId;
    this.username = data.username;
    this.displayName = data.displayName;
    this.assignedTasks = data.assignedTasks;
    this.createdTasks = data.createdTasks;
    this.completedTasks = data.completedTasks;
    this.overdueTasks = data.overdueTasks;
    this.completionRate = data.completionRate;
    this.statusDistribution = data.statusDistribution;
    this.priorityDistribution = data.priorityDistribution;
  }
}
