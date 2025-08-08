import { BoardDTO as BoardDTOInterface } from '../requestModels/model/boardDTO';
import { ColumnInstance } from './ColumnInstance';
import { UserInstance } from './UserInstance';
import { LabelInstance } from './LabelInstance';

export class BoardInstance implements BoardDTOInterface {
  id?: number;
  name: string;
  description?: string;
  settings?: string;
  invitationCode?: string;
  archived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: UserInstance;
  columns?: Array<ColumnInstance>;
  labels?: Array<LabelInstance>;

  constructor(data: BoardDTOInterface) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.settings = data.settings;
    this.invitationCode = data.invitationCode;
    this.archived = data.archived;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy
      ? new UserInstance(data.createdBy)
      : undefined;
    this.columns = data.columns
      ? data.columns.map(column => new ColumnInstance(column))
      : undefined;
    this.labels = data.labels
      ? data.labels.map(label => new LabelInstance(label))
      : undefined;
  }
}
