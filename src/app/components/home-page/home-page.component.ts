import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { KEY } from 'src/app/constants';
import { CategoryService } from 'src/app/services/category.service';
import firebase from 'firebase/compat/app';
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

  user: firebase.User | null | undefined;

  constructor(
    private flashcardService: FlashcardService,
    private categoryService: CategoryService,
    private fireAuth: AngularFireAuth,
    private toastr: ToastrService
  ) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key !== KEY.f) {
      event.stopImmediatePropagation();
    }

    if (event.key === KEY.space) {
      if (this.flashcards.length === 1) {
        this.toastr.warning('There is only 1 flashcard of this category!');
      }

      this.updateNextFlashcardIndex();
    }

    if (event.key === KEY.d) {
      const confirmed = confirm('Do you want to delete current flashcard?');
      const currentFlashcardIndex = this.currentIndex;

      if (confirmed) {
        setTimeout(() => {
          this.flashcardService.delete(this.flashcards[currentFlashcardIndex].key!);
        });
      }

    }
  }

  ngOnInit(): void {
    this.fireAuth.authState.subscribe((user) => (this.user = user));

    combineLatest([
      this.flashcardService.getAll(),
      this.categoryService.getSelectedCategory(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([flashcards, selectedCategory]) => {
        this.isLoading = false;
        this.flashcards = flashcards.filter(
          (flashcard) => flashcard.category === selectedCategory
        );
        CACHE.isInitialize = false;
        CACHE.flashcards = flashcards;
      });
  }

  private updateNextFlashcardIndex(): void {
    console.log('how many times');

    this.currentIndex = this.flashcards[this.currentIndex + 1]
      ? this.currentIndex + 1
      : 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
