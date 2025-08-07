import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { TranslateModule } from "@ngx-translate/core";
import { AvatarService } from "../../api/avatar.service";
import { UserInstance } from "../../models/classes/UserInstance";
import { getUserDisplayName, getUserInitials } from "../../utils/user.utils";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "kn-user-display",
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: "./user-display.component.html",
  styleUrl: "./user-display.component.scss",
})
export class UserDisplayComponent {
  user = input<UserInstance | null>();
  avatarService = inject(AvatarService);

  getUserDisplayName = getUserDisplayName;
  getUserInitials = getUserInitials;

  getAvatarUrl(user: UserInstance | null): string {
    return this.avatarService.getAvatarUrl(user?.avatar);
  }
}
