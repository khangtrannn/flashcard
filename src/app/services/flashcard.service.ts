import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, Subject, map, switchMap } from 'rxjs';
import { FIREBASE_GOOGLE_UID } from './../constants';
import { CategoryService } from './category.service';

const HIGHLIGHT_TEMPLATE =
  '<div><span style="background-color: rgb(219, 15, 15);">&#8203;</span></div>';

export class Flashcard {
  key: string | undefined;
  category: string | undefined | null;
  content: string | undefined;
  highlight = HIGHLIGHT_TEMPLATE;
}

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private dbPath = '/flashcards';
  private flip$ = new Subject<string>();
  private flashcardsRef: AngularFireList<Flashcard>;

  private cache$: Observable<Flashcard[]> | undefined;

  constructor(
    private db: AngularFireDatabase,
    private categoryService: CategoryService
  ) {
    const uid = window.localStorage.getItem(FIREBASE_GOOGLE_UID);
    this.flashcardsRef = db.list<Flashcard>(`${this.dbPath}/${uid}`);
  }

  getAll(): Observable<Flashcard[]> {
    if (!this.cache$) {
      this.cache$ = this.flashcardsRef.snapshotChanges().pipe(
        map((changes) =>
          changes
            .map(
              (change) =>
                ({
                  key: change.payload.key,
                  ...change.payload.val(),
                } as Flashcard)
            )
            .sort(() => Math.random() - 0.5)
        )
      );
    }

    return this.cache$;
  }

  getAllBySelectedCategory(): Observable<Flashcard[]> {
    return this.categoryService.getSelectedCategory().pipe(
      switchMap((selectedCategory) => {
        if (selectedCategory) {
          return this.getAll().pipe(
            map((flashcards) =>
              flashcards.filter(
                (flashcard) => flashcard.category === selectedCategory
              )
            )
          );
        }

        return this.getAll();
      })
    );
  }

  create(flashcard: Flashcard) {
    return this.flashcardsRef.push(flashcard);
  }

  delete(id: string): void {
    this.flashcardsRef.remove(id);
  }

  update(flashcard: Flashcard) {
    return this.flashcardsRef.update(flashcard.key!, flashcard);
  }

  flip(face: string): void {
    this.flip$.next(face);
  }

  onFlip(): Observable<string> {
    return this.flip$.asObservable();
  }
}
