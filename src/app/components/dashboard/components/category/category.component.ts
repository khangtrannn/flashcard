import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { FLASHCARD_INDEX } from 'src/app/constants';
import { Category, CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() showList = true;
  @Input() showLoading = true;

  @Output() categoryChange = new EventEmitter<void>();

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
        this.flashcardCategories = categories;

        if (selectedCategory) {
          this.selectedCategory = this.flashcardCategories.find(
            (category) => category.key === selectedCategory
          )?.name;
        }
      });
  }

  onCategoryChange(id: string): void {
    window.localStorage.setItem(FLASHCARD_INDEX, id);
    this.categoryService.setSelectedCategory(id);
    this.categoryChange.next();
  }

  onAddNewCategory(category: string): string {
    this.categoryService.create(category).then((data) => {
      this.categoryService.setSelectedCategory(data.key!);
    });

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
