import { Component, HostListener, Input } from '@angular/core';
import { KEY } from 'src/app/constants';
import { FlashcardService } from 'src/app/services/flashcard.service';

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
