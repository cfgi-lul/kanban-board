import { Component, ElementRef, ViewChild, forwardRef, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'kn-task-description',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MarkdownComponent,
    MarkdownModule,
    TranslateModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaskDescriptionComponent),
      multi: true,
    },
  ],
  templateUrl: './task-description.component.html',
  styleUrl: './task-description.component.scss',
})
export class TaskDescriptionComponent implements ControlValueAccessor {
  isEdit = input<boolean>(false);
  toggle = output<void>();

  value: string = '';
  disabled = false;
  @ViewChild('mdInput') private textareaRef?: ElementRef<HTMLTextAreaElement>;

  private onChange: (val: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: string | null): void {
    this.value = obj ?? '';
  }

  registerOnChange(fn: (val: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onToggle(): void {
    this.toggle.emit();
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  markTouched(): void {
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === 'Tab') {
      event.preventDefault();
      this.insertSnippet('  ');
    }
  }

  // Formatting helpers
  bold(): void {
    this.wrapSelection('**');
  }

  italic(): void {
    this.wrapSelection('*');
  }

  strikethrough(): void {
    this.wrapSelection('~~');
  }

  inlineCode(): void {
    this.wrapSelection('`');
  }

  heading(): void {
    this.prefixLines('# ');
  }

  blockquote(): void {
    this.prefixLines('> ');
  }

  unorderedList(): void {
    this.prefixLines('- ');
  }

  orderedList(): void {
    this.prefixLines('1. ');
  }

  codeBlock(): void {
    this.wrapBlock('``````');
  }

  link(): void {
    this.wrapSelection('[', '](https://)');
  }

  image(): void {
    this.wrapSelection('![', '](https://)');
  }

  private getTextarea(): HTMLTextAreaElement | undefined {
    return this.textareaRef?.nativeElement;
  }

  private updateValue(newValue: string, newSelectionStart?: number, newSelectionEnd?: number): void {
    this.value = newValue;
    this.onChange(this.value);
    const ta = this.getTextarea();
    if (ta && newSelectionStart != null && newSelectionEnd != null) {
      queueMicrotask(() => {
        ta.selectionStart = newSelectionStart;
        ta.selectionEnd = newSelectionEnd;
        ta.focus();
      });
    }
  }

  private wrapSelection(prefix: string, suffix?: string): void {
    if (this.disabled) return;
    const ta = this.getTextarea();
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = this.value.slice(0, start);
    const selected = this.value.slice(start, end) || '';
    const after = this.value.slice(end);
    const closing = suffix ?? prefix;
    const newSelected = `${prefix}${selected || ''}${closing}`;
    const newValue = `${before}${newSelected}${after}`;
    const caretStart = before.length + prefix.length;
    const caretEnd = caretStart + (selected ? selected.length : 0);
    this.updateValue(newValue, caretStart, caretEnd);
  }

  private wrapBlock(fence: string): void {
    if (this.disabled) return;
    const ta = this.getTextarea();
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = this.value.slice(0, start);
    const selected = this.value.slice(start, end) || '';
    const after = this.value.slice(end);
    const newSelected = `\n${'```'}\n${selected}\n${'```'}\n`;
    const newValue = `${before}${newSelected}${after}`;
    const caret = before.length + 4; // inside first line after ```\n
    this.updateValue(newValue, caret, caret + selected.length);
  }

  private prefixLines(prefix: string): void {
    if (this.disabled) return;
    const ta = this.getTextarea();
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = this.value.slice(0, start);
    const selected = this.value.slice(start, end);
    const after = this.value.slice(end);

    const selection = selected || this.currentLineAt(start);
    const lines = selection.split(/\r?\n/);
    const prefixed = lines.map((l) => (l.length ? prefix + l : l)).join('\n');
    const newValue = `${before}${prefixed}${after}`;
    const caretStart = before.length;
    const caretEnd = caretStart + prefixed.length;
    this.updateValue(newValue, caretStart, caretEnd);
  }

  private currentLineAt(index: number): string {
    const startIdx = this.value.lastIndexOf('\n', index - 1) + 1;
    const endIdx = this.value.indexOf('\n', index);
    return this.value.slice(startIdx, endIdx === -1 ? undefined : endIdx);
  }

  private insertSnippet(snippet: string): void {
    if (this.disabled) return;
    const ta = this.getTextarea();
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = this.value.slice(0, start);
    const after = this.value.slice(end);
    const newValue = `${before}${snippet}${after}`;
    const caret = before.length + snippet.length;
    this.updateValue(newValue, caret, caret);
  }
}