import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class MarkdownModule {}

export const provideMarkdown = () => ({
  provide: 'MARKDOWN_CONFIG',
  useValue: {},
});

export class MarkdownComponent {
  data = '';
}
