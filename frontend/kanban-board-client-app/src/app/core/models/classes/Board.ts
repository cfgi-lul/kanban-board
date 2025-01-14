import { BoardDTO } from '../requestModels/model/boardDTO';
import { Column } from './Column';

export class Board implements BoardDTO {
  id: number;
  name: string;
  columns: Column[];
  constructor(data: BoardDTO) {
    this.id = data.id;
    this.name = data.name;
    this.columns = data.columns;
  }
}
