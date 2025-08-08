import { Component, inject, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslateModule } from "@ngx-translate/core";
import { BoardInstance } from "../../../core/models/classes/BoardInstance";

@Component({
  selector: "kn-board-card",
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: "./board-card.component.html",
  styleUrl: "./board-card.component.scss",
})
export class BoardCardComponent {
  readonly board = input.required<BoardInstance>();
  readonly allowDelete = input<boolean>(false);

  readonly onBoardDeleted = output<void>();
  readonly onBoardOpened = output<void>();
}
