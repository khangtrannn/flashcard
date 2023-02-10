import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, filter, Subject, take, takeUntil } from 'rxjs';
import { Category, CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() showList = true;
  @Input() hideIfNoFlashcards = false;
  @Input() showLoading = true;

  isLoading = true;
  flashcardCategories: Category[] = [];
  selectedCategory: string | undefined;

  constructor(public categoryService: CategoryService) {}

  ngOnInit(): void {
    combineLatest([
      this.categoryService.getAll(),
      this.categoryService.getSelectedCategory(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([categories, selectedCategory]) => {
        this.isLoading = false;
        this.flashcardCategories = categories;

        if (selectedCategory) {
          this.selectedCategory = this.flashcardCategories.find(
            (category) => category.key === selectedCategory
          )?.name;
        }
      });
  }

  handleAddNewCategory(category: string): string {
    this.categoryService.create(category);
    return category;
  }

  onRemoveCategory(id: string, name: string): void {
    const confirmed = window.confirm(
      `Do you want to delete category "${name}"?`
    );

    if (confirmed) {
      this.categoryService.hide(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
