import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { filter, first, map, Observable, Subject } from 'rxjs';
import { FIREBASE_GOOGLE_UID } from './../constants';

export interface Flashcard {
  key?: string;
  front: string;
  back: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private dbPath = '/flashcards';
  private _shouldListenShortcut = true;
  private flip$ = new Subject<string>();
  private flashcardsRef: AngularFireList<Flashcard>;

  private cache$: Observable<Flashcard[]> | undefined;

  constructor(private db: AngularFireDatabase) {
    const uid = window.localStorage.getItem(FIREBASE_GOOGLE_UID);
    this.flashcardsRef = db.list<Flashcard>(`${this.dbPath}/${uid}`);
  }

  getAll(): Observable<Flashcard[]> {
    if (!this.cache$) {
      this.cache$ = this.flashcardsRef.snapshotChanges().pipe(
        map((changes) =>
          changes.map(
            (change) =>
              ({
                key: change.payload.key,
                ...change.payload.val(),
              } as Flashcard)
          ).sort(() => Math.random() - 0.5)
        )
      );
    }

    return this.cache$;
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

  disableShortcutListener(): void {
    this._shouldListenShortcut = false;
  }

  enableShortcutListener(): void {
    this._shouldListenShortcut = true;
  }

  get shouldListenShortcut(): boolean {
    return this._shouldListenShortcut;
  }
}
