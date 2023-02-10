import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, take, takeUntil } from 'rxjs';
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
  selectedCategory$ = this.categoryService.getSelectedCategory();

  constructor(public categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.isLoading = false;
        this.flashcardCategories = categories;
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
