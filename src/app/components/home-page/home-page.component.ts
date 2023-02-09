import { trigger, transition, style, animate } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { KEY } from 'src/app/constants';
import { Flashcard, FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('swapAnimation', [
      transition(':leave', [
        style({ position: 'absolute', 'transform-origin': 'bottom right', opacity: 1, 'z-index': 1, background: '#222222', 'border-radius': '15px' }),
        animate('0.7s ease-out', style({ 
          transform: 'rotate(72deg)', opacity: 1, background: '#222222'
        })),
      ]),
    ])
  ],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  flashcards: Flashcard[] = [];
  currentIndex = 0;
  isLoading = true;

  constructor(private flashcardService: FlashcardService) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY.space) {
      event.stopImmediatePropagation();
      this.currentIndex = this.flashcards[this.currentIndex + 1] ? this.currentIndex + 1 : 0;
    }
  }

  ngOnInit(): void {
    this.flashcardService.getAll().pipe(takeUntil(this.destroy$)).subscribe((flashcards) => {
      this.flashcards = flashcards;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
