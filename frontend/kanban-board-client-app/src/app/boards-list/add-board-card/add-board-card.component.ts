import { Component, inject, output } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { AuthService } from "../../core/api/auth.service";
import { CreateBoardModalComponent } from "../create-board-modal/create-board-modal.component";
import { BoardInstance } from "../../core/models/classes/BoardInstance";
import { MatRippleModule } from "@angular/material/core";

@Component({
  selector: "kn-add-board-card",
  standalone: true,
  imports: [MatCardModule, MatIconModule, TranslateModule, MatRippleModule],
  templateUrl: "./add-board-card.component.html",
  styleUrl: "./add-board-card.component.scss",
})
export class AddBoardCardComponent {
  readonly onBoardCreate = output<void>();
}
