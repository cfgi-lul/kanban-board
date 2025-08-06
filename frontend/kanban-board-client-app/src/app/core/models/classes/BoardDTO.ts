import { BoardDTO as BoardDTOInterface } from '../requestModels/model/boardDTO';
import { ColumnDTO } from './ColumnDTO';

export class BoardDTO implements BoardDTOInterface {
  id?: number;
  name: string;
  columns?: Array<ColumnDTO>;

  constructor(data: BoardDTOInterface) {
    this.id = data.id;
    this.name = data.name;
    this.columns = data.columns;
  }
}
