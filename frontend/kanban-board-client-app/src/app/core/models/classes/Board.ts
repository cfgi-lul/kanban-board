import { BoardDTO } from '../requestModels/model/boardDTO';
import { ColumnDTO } from '../requestModels/model/columnDTO';

export class Board implements BoardDTO {
  id?: number;
  name: string;
  columns?: Array<ColumnDTO>;

  constructor(data: BoardDTO) {
    this.id = data.id;
    this.name = data.name;
    this.columns = data.columns;
  }
}
