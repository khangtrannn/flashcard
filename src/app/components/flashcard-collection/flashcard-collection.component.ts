import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private flashcardService: FlashcardService,
    private router: Router
  ) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY.space) {
      this.flashcardCollection.next();
    }

    if (event.key === KEY.b) {
      this.flashcardCollection.prev();
    }

    if (event.key === KEY.e) {
      this.router.navigate(['/dashboard'], {
        queryParams: {
          flashcardId: this.flashcardCollection.activeId,
        },
      });
    }

    if (event.key === KEY.d) {
      this.flashcardService.delete(this.flashcardCollection.activeId);
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
