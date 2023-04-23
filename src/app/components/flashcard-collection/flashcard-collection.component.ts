import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { KEY } from 'src/app/constants';
import {
  Flashcard,
  FlashcardService,
} from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-flashcard-collection',
  templateUrl: './flashcard-collection.component.html',
  styleUrls: ['./flashcard-collection.component.scss'],
})
export class FlashcardCollectionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  flashcards: Flashcard[] | undefined;

  @ViewChild('flashcardCollection', { static: false })
  flashcardCollection!: NgbCarousel;

  constructor(private flashcardService: FlashcardService) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY.space) {
      this.flashcardCollection.next();
    }

    if (event.key === KEY.b) {
      this.flashcardCollection.prev();
    }
  }

  ngOnInit(): void {
    this.flashcardService
      .getAllBySelectedCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((flashcards) => {
        this.flashcards = flashcards;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
