export class TaskPreviewInstance {
  id?: number;
  title: string;
  position?: number;

  constructor(data: { id?: number; title: string; position?: number }) {
    this.id = data.id;
    this.title = data.title;
    this.position = data.position;
  }
}
