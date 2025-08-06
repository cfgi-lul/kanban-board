import { PerformanceMetrics as PerformanceMetricsInterface } from '../requestModels/model/performanceMetrics';

export class PerformanceMetricsInstance implements PerformanceMetricsInterface {
  totalBoards?: number;
  totalTasks?: number;
  totalUsers?: number;
  activeBoards?: number;
  recentTasks?: number;
  lastOptimization?: Date;

  constructor(data: PerformanceMetricsInterface) {
    this.totalBoards = data.totalBoards;
    this.totalTasks = data.totalTasks;
    this.totalUsers = data.totalUsers;
    this.activeBoards = data.activeBoards;
    this.recentTasks = data.recentTasks;
    this.lastOptimization = data.lastOptimization;
  }
}
