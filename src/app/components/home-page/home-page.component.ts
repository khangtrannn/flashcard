import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, forkJoin, Subject, takeUntil } from 'rxjs';
import { KEY } from 'src/app/constants';
import { CategoryService } from 'src/app/services/category.service';
import {
  Flashcard,
  FlashcardService,
} from 'src/app/services/flashcard.service';

const CACHE: { isInitialize: boolean; flashcards: Flashcard[] } = {
  isInitialize: true,
  flashcards: [],
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('swapAnimation', [
      transition(':leave', [
        style({
          position: 'absolute',
          'transform-origin': 'bottom right',
          opacity: 1,
          'z-index': 1,
          background: '#222222',
          'border-radius': '15px',
        }),
        animate(
          '0.7s ease-out',
          style({
            transform: 'rotate(72deg)',
            opacity: 1,
            background: '#222222',
          })
        ),
      ]),
    ]),
  ],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  flashcards: Flashcard[] = CACHE.flashcards;
  currentIndex = 0;
  isLoading = CACHE.isInitialize;

  constructor(
    private flashcardService: FlashcardService,
    private categoryService: CategoryService
  ) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY.space) {
      event.stopImmediatePropagation();
      this.currentIndex = this.flashcards[this.currentIndex + 1]
        ? this.currentIndex + 1
        : 0;
    }
  }

  ngOnInit(): void {
    combineLatest([
      this.flashcardService.getAll(),
      this.categoryService.getSelectedCategory(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([flashcards, selectedCategory]) => {
        console.log(flashcards);
        console.log(selectedCategory);

        this.isLoading = false;
        this.flashcards = flashcards.filter(
          (flashcard) => flashcard.category === selectedCategory
        );
        CACHE.isInitialize = false;
        CACHE.flashcards = flashcards;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
