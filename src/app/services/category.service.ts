import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { FIREBASE_GOOGLE_UID } from './../constants';

export interface Category {
  key?: string;
  name: string;
  isHidden: boolean;
}

export const SELECT_CATEGORY_KEY = 'SELECT_CATEGORY_KEY';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private dbPath = '/categories';
  private categoryRef: AngularFireList<Category>;

  private cache$: Observable<Category[]> | undefined;
  private selectedCategory$ = new BehaviorSubject<string | null>(
    window.localStorage.getItem(SELECT_CATEGORY_KEY)
  );

  constructor(private db: AngularFireDatabase) {
    const uid = window.localStorage.getItem(FIREBASE_GOOGLE_UID);
    this.categoryRef = db.list<Category>(`${this.dbPath}/${uid}`);
  }

  getAll(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.categoryRef.snapshotChanges().pipe(
        map((changes) =>
          changes
            .map(
              (change) =>
                ({
                  key: change.payload.key,
                  ...change.payload.val(),
                } as Category)
            )
            .filter((category) => !category.isHidden)
        )
      );
    }

    return this.cache$;
  }

  create(category: string) {
    return this.categoryRef.push({ name: category, isHidden: false });
  }

  hide(id: string): void {
    this.categoryRef.update(id, { isHidden: true });

    if (this.selectedCategory$.getValue() === id) {
      window.localStorage.removeItem(SELECT_CATEGORY_KEY);
    }
  }

  setSelectedCategory(id: string): void {
    window.localStorage.setItem(SELECT_CATEGORY_KEY, id);
    this.selectedCategory$.next(id);
  }

  getSelectedCategory(): Observable<string | null> {
    return this.selectedCategory$.asObservable();
  }
}
