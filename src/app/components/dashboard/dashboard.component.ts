import { Subject, take, takeUntil } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Flashcard,
  FlashcardService,
} from 'src/app/services/flashcard.service';
import { EditorConfig } from '../../configs/EditorConfig';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly FRONT_TEMPLATE =
    '<div style="text-align: center;"><span style="background-color: rgb(219, 15, 15);"><font size="3">phrase</font></span></div><div style="text-align: center;"><span style="background-color: rgb(219, 15, 15); font-size: 0.875rem;"><br></span></div><div style="text-align: center;"><span style="text-align: center;">Vietnamese meaning</span><br></div>';

  private destroy$ = new Subject<void>();

  editorConfig = EditorConfig;

  flashcard: Flashcard | undefined;

  selectedCategory$ = this.categoryService.getSelectedCategory();

  constructor(
    public flashcardService: FlashcardService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private elementRef: ElementRef<HTMLDivElement>,
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
        // this.flashcard.category = selectedCategory!;
        // if (!this.flashcard.content || !selectedCategory) {
        //   return;
        // }
        // if (!this.flashcard.key) {
        //   this.handleAddFlashcard();
        // } else {
        //   this.handleUpdateFlashcard();
        // }
      });
  }

  private handleUpdateFlashcard(): void {
    // this.flashcardService
    //   .update(this.flashcard)
    //   .then((_) => {
    //     this.toastr.success('Update flashcard successfully!');
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     this.toastr.error('Update flashcard failed!');
    //   });
  }

  private handleAddFlashcard(): void {
    // this.flashcardService
    //   .create(this.flashcard)
    //   .then((_) => {
    //     this.resetState();
    //     this.toastr.success('Add new flashcard successfully!');
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     this.toastr.error('Add new flashcard error!');
    //   });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement
      .querySelectorAll('angular-editor')
      .forEach((editor) =>
        editor
          .querySelector('.angular-editor-textarea')!
          .addEventListener('focus', () =>
            this.flashcardService.flip(editor.getAttribute('name')!)
          )
      );
  }

  private resetState(): void {
    // this.flashcard.content = this.FRONT_TEMPLATE;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
