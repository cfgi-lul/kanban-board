export class TaskPreviewInstance {
  id?: number;
  title: string;

  constructor(data: { id?: number; title: string }) {
    this.id = data.id;
    this.title = data.title;
  }
}
