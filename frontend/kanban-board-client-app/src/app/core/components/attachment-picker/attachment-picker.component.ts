import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

import { FileSizePipe } from '../../pipes/file-size.pipe';
import { AttachmentService } from '../../api/attachment.service';
import { AttachmentInstance } from '../../models/classes/AttachmentInstance';

@Component({
  selector: 'kn-attachment-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule,
    MatCardModule,
    TranslateModule,
    FileSizePipe,
  ],
  templateUrl: './attachment-picker.component.html',
  styleUrl: './attachment-picker.component.scss',
})
export class AttachmentPickerComponent {
  private attachmentService = inject(AttachmentService);

  readonly taskId = input<number | null>(null);

  readonly uploaded = new EventEmitter<AttachmentInstance>();
  readonly deleted = new EventEmitter<number>();

  readonly attachments = signal<AttachmentInstance[]>([]);

  private readonly onTaskIdChange = effect(() => {
    const id = this.taskId();
    console.log('onTaskIdChange', id);
    if (id !== null && id !== undefined) {
      this.loadAttachments(id);
    }
  });

  onTriggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.files || inputEl.files.length === 0) return;
    const files = Array.from(inputEl.files);
    inputEl.value = '';
    this.uploadFilesSequentially(files);
  }

  deleteAttachment(attachment: AttachmentInstance): void {
    const id = attachment.id;
    if (id === undefined || id === null) return;
    this.attachmentService.deleteAttachment(id).subscribe(() => {
      this.deleted.emit(id);
      this.refresh();
    });
  }

  downloadAttachment(attachment: AttachmentInstance): void {
    if (attachment.id === undefined || attachment.id === null) return;
    this.attachmentService
      .downloadAttachment(attachment.id)
      .subscribe(blob => this.saveBlob(blob, attachment.originalFilename));
  }

  private refresh(): void {
    const id = this.taskId();
    if (id !== null && id !== undefined) {
      this.loadAttachments(id);
    }
  }

  private loadAttachments(taskId: number): void {
    this.attachmentService.getAttachmentsByTask(taskId).subscribe(list => {
      this.attachments.set(Array.isArray(list) ? list : []);
    });
  }

  private uploadFilesSequentially(files: File[]): void {
    if (files.length === 0) return;
    const [head, ...tail] = files;
    this.uploadSingleFile(head, () => this.uploadFilesSequentially(tail));
  }

  private uploadSingleFile(file: File, onDone: () => void): void {
    const id = this.taskId();
    if (id === null || id === undefined) return;
    this.attachmentService.uploadAttachment(id, file).subscribe(att => {
      this.uploaded.emit(att);
      this.refresh();
      onDone();
    });
  }

  private saveBlob(blob: Blob, filename?: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  openInNewTab(attachment: AttachmentInstance): void {
    const url = attachment.fileUrl;
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  isImage(attachment: AttachmentInstance): boolean {
    return (attachment.contentType || '').startsWith('image/');
  }

  isVideo(attachment: AttachmentInstance): boolean {
    return (attachment.contentType || '').startsWith('video/');
  }

  isText(attachment: AttachmentInstance): boolean {
    return (attachment.contentType || '').startsWith('text/');
  }
}
