import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';

@Component({
  selector: 'kn-board-settings-page',
  standalone: true,
  imports: [
    // Angular
    AsyncPipe,
    NgIf,
    RouterModule,
    // Material
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    // i18n
    TranslateModule,
  ],
  templateUrl: './board-settings-page.component.html',
  styleUrl: './board-settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardSettingsPageComponent {
  private route = inject(ActivatedRoute);

  readonly boardId$ = this.route.paramMap.pipe(map(params => params.get('id')));
}

