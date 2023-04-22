import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { KEY } from 'src/app/constants';
import { FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
})
export class FlashcardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  shouldFlip = false;

  @Input() highlight: string | undefined;
  @Input() content: string | undefined;

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.flashcardService
      .onFlip()
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((showFace) => {
        this.shouldFlip = showFace === 'back';
      });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === KEY.f) {
      this.toggleFlipFlashcard();
    }
  }

  private toggleFlipFlashcard(): void {
    this.shouldFlip = !this.shouldFlip;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
