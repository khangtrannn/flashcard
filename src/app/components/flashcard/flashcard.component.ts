import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FlashcardService } from 'src/app/services/flashcard.service';

const KEY = {
  space: ' ',
  f: 'f',
};

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent {
  shouldFlip = false;

  @Input() front: string | undefined;
  @Input() back: string | undefined;

  constructor(private flashcardService: FlashcardService) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.flashcardService.shouldListenShortcut) {
      return;
    }

    if (event.key === KEY.f) {
      this.shouldFlip = !this.shouldFlip;
    }
  }
}
