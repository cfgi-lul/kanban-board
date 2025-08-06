import { StatusDistribution as StatusDistributionInterface } from '../requestModels/model/statusDistribution';

export class StatusDistributionInstance implements StatusDistributionInterface {
  todo?: number;
  inProgress?: number;
  review?: number;
  done?: number;

  constructor(data: StatusDistributionInterface) {
    this.todo = data.todo;
    this.inProgress = data.inProgress;
    this.review = data.review;
    this.done = data.done;
  }
}
