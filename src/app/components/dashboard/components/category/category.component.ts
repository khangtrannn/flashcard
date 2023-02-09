import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { Category, CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>;
  isLoading = true;

  flashcardCategories: Category[] = [];
  selectedCategory: string | undefined;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAll()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.flashcardCategories = categories;
        this.selectedCategory = this.flashcardCategories[0]?.name;
        this.isLoading = false;
      });
  }

  handleAddNewCategory(category: string): string {
    this.categoryService.create(category).then((data) => console.log(data));
    return category;
  }

  onRemoveCategory(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
