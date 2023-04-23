import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import {
  Flashcard,
  FlashcardService,
} from 'src/app/services/flashcard.service';
import { EditorConfig } from '../../configs/EditorConfig';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  editorConfig = EditorConfig;
  flashcard: Flashcard = new Flashcard();
  selectedCategory$ = this.categoryService.getSelectedCategory();

  constructor(
    public flashcardService: FlashcardService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const flashcardID =
      this.activatedRoute.snapshot.queryParamMap.get('flashcardId');

    if (flashcardID) {
      this.flashcardService
        .getAll()
        .pipe(takeUntil(this.destroy$))
        .subscribe((flashcards) => {
          const findFlashcard = flashcards.find(
            (flashcard) => flashcard.key === flashcardID
          );

          if (findFlashcard) {
            this.flashcard = findFlashcard;
          }
        });
    }
  }

  onSubmitFlashcard(): void {
    this.selectedCategory$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((selectedCategory) => {
        if (this.flashcard.key) {
          this.handleUpdateFlashcard();
        } else {
          this.flashcard.category = selectedCategory;
          this.handleAddFlashcard();
        }
      });
  }

  private handleUpdateFlashcard(): void {
    this.flashcardService
      .update(this.flashcard)
      .then((_) => {
        this.toastr.success('Update flashcard successfully!');
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Update flashcard failed!');
      });
  }

  private handleAddFlashcard(): void {
    this.flashcardService
      .create(this.flashcard)
      .then((_) => {
        this.resetState();
        this.toastr.success('Add new flashcard successfully!');
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Add new flashcard error!');
      });
  }

  private resetState(): void {
    this.flashcard = new Flashcard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
