import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent {
  readonly KEY = {
    space: ' ',
    f: 'f',
  };

  shouldFlip = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === this.KEY.f) {
      this.shouldFlip = !this.shouldFlip;
    }
  }
}
