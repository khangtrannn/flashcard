import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';

export interface Category {
  key?: string;
  name: string;
  isHidden: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private dbPath = '/categories';
  private categoryRef: AngularFireList<Category>;

  private cache$: Observable<Category[]> | undefined;

  constructor(private db: AngularFireDatabase) {
    this.categoryRef = db.list<Category>(this.dbPath);
  }

  getAll(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.categoryRef.snapshotChanges().pipe(
        map((changes) => changes.map(change => ({ key: change.payload.key, ...change.payload.val() }) as Category))
      );
    }
    
    return this.cache$;
  }

  create(category: string) {
    return this.categoryRef.push({ name: category, isHidden: false });
  }
}
