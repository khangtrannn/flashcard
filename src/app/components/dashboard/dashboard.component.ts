import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Flashcard,
  FlashcardService,
} from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  front = '';
  back = '';

  constructor(
    public flashcardService: FlashcardService,
    private toastr: ToastrService
  ) {}

  onAddFlashcard(): void {
    if (!this.front) {
      return;
    }

    const payload: Flashcard = {
      front: this.front,
      back: this.back,
    };

    this.flashcardService
      .create(payload)
      .then((_) => {
        this.resetState();
        this.toastr.success('Add new flashcard successfully!');
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Add new flashcard error!');
      });
  }

  private resetState(): void {
    this.front = '';
    this.back = '';
  }
}
