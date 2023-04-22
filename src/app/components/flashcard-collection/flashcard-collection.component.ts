import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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

  constructor(private flashcardService: FlashcardService) {}

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
