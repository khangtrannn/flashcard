import { FLASHCARD_INDEX, FIREBASE_GOOGLE_UID } from './../../constants';
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
import { Router } from '@angular/router';

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
  _currentIndex = Number(window.localStorage.getItem(FLASHCARD_INDEX));
  isLoading = CACHE.isInitialize;

  user: firebase.User | null | undefined;

  constructor(
    private flashcardService: FlashcardService,
    private categoryService: CategoryService,
    private fireAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(index: number) {
    window.localStorage.setItem(FLASHCARD_INDEX, index.toString());
    this._currentIndex = index;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key !== KEY.f) {
      event.stopImmediatePropagation();
    }

    switch (event.key) {
      case KEY.space:
        this.handleNextFlashcard();
        break;
      case KEY.d:
        this.handleDeleteFlashcard();
        break;
      case KEY.l:
        this.handleLogout();
        break;
      case KEY.b:
        this.handleBackToPreviousFlashcard();
        break;
      default:
        return;
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

  private handleDeleteFlashcard(): void {
    const confirmed = confirm('Do you want to delete current flashcard?');
    const currentFlashcardIndex = this.currentIndex;

    if (confirmed) {
      if (currentFlashcardIndex == this.flashcards.length - 1) {
        this.currentIndex = 0;
      }

      setTimeout(() => {
        this.flashcardService.delete(this.flashcards[currentFlashcardIndex].key!);
      });
    }
  }

  private handleNextFlashcard(): void {
    if (this.flashcards.length === 1) {
      this.toastr.warning('There is only 1 flashcard of this category!');
    }

    this.updateNextFlashcardIndex();
  }

  private handleBackToPreviousFlashcard(): void {
    this.updatePreviousFlashcardIndex();
  }

  private handleLogout(): void {
    const confirmed = confirm('Do you want to logout?');
    if (confirmed) {
      this.fireAuth.signOut();
      window.localStorage.removeItem(FIREBASE_GOOGLE_UID);
      window.localStorage.removeItem(FLASHCARD_INDEX);
      this.router.navigateByUrl('/login');
    }
  }

  private updateNextFlashcardIndex(): void {
    this.currentIndex = this.flashcards[this.currentIndex + 1]
      ? this.currentIndex + 1
      : 0;
  }

  private updatePreviousFlashcardIndex(): void {
    this.currentIndex = this.flashcards[this.currentIndex - 1]
      ? this.currentIndex - 1
      : this.flashcards.length - 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
