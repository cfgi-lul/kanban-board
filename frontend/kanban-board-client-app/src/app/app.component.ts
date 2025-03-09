import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/api/auth.service';
import { HeaderComponent } from './core/components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatGridListModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'kanban-board-client-app';
  isSidenavOpen = false;
  currentUser = inject(AuthService)
    .current()
    .pipe(tap((e) => console.log(123)));
  isAdmin = inject(AuthService).isAdmin();

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
