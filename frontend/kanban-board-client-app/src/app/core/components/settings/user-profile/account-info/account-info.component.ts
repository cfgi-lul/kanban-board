import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { UserInstance } from '../../../../models/classes/UserInstance';

@Component({
  selector: 'kn-account-info',
  imports: [CommonModule, MatChipsModule, TranslateModule],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent {
  @Input() currentUser: UserInstance | null = null;
}
