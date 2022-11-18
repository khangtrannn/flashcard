import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent {
  readonly F_KEY = 'f';

  shouldFlip = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === this.F_KEY) {
      this.shouldFlip = !this.shouldFlip;
    }
  }
}
