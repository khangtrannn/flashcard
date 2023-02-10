import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { Category, CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;

  flashcardCategories: Category[] = [];
  selectedCategory: string | undefined;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.flashcardCategories = categories;
        this.selectedCategory = this.flashcardCategories[0]?.name;
        this.isLoading = false;
      });
  }

  handleAddNewCategory(category: string): string {
    this.categoryService.create(category);
    return category;
  }

  onRemoveCategory(id: string, name: string): void {
    const confirmed = window.confirm(`Do you want to delete category "${name}"?`);

    if (confirmed) {
      this.categoryService.hide(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
