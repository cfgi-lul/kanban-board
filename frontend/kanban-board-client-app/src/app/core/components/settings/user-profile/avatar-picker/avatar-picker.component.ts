import {
  Component,
  ElementRef,
  output,
  input,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'kn-avatar-picker',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './avatar-picker.component.html',
  styleUrls: ['./avatar-picker.component.scss'],
})
export class AvatarPickerComponent {
  avatarUrl = input<string>('');
  hasAvatar = input<boolean>(false);
  isUploading = input<boolean>(false);

  fileSelected = output<File>();
  removeAvatar = output<void>();

  readonly fileInput =
    viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  onAvatarClick(): void {
    this.fileInput().nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected.emit(file);
      // Clear the file input
      this.fileInput().nativeElement.value = '';
    }
  }

  onRemoveAvatar(): void {
    this.removeAvatar.emit();
  }
}
