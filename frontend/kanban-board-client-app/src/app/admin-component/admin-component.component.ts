import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../core/api/user.service';

@Component({
  selector: 'app-admin-component',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    AsyncPipe,
  ],
  templateUrl: './admin-component.component.html',
  styleUrl: './admin-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponentComponent {
  displayedColumns = ['id', 'username', 'name', 'roles', 'actions'];
  userService = inject(UserService);
  users$ = this.userService.getAllUsers();

  constructor() {}

  promoteToAdmin(userId: number): void {
    this.userService.promoteToAdmin(userId).subscribe();
  }
}
