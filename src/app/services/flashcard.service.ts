import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ThenableReference } from '@angular/fire/database';
import { map, Observable } from 'rxjs';

export interface Flashcard {
  key?: string;
  front: string;
  back: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private dbPath = '/flashcards';
  private _shouldListenShortcut = true;
  flashcardsRef: AngularFireList<Flashcard>;

  constructor(private db: AngularFireDatabase) {
    this.flashcardsRef = db.list<Flashcard>(this.dbPath);
  }

  getAll(): Observable<Flashcard[]> {
    return this.flashcardsRef.snapshotChanges().pipe(
      map((changes) => changes.map(change => ({ key: change.payload.key, ...change.payload.val() }) as Flashcard))
    );
  }

  create(flashcard: Flashcard) {
    return this.flashcardsRef.push(flashcard);
  }

  update(key: string, value: any): Promise<void> {
    return this.flashcardsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.flashcardsRef.remove(key);
  }

  get shouldListenShortcut(): boolean {
    return this._shouldListenShortcut;
  }

  set shouldListenShortcut(value: boolean) {
    this._shouldListenShortcut = value;
  }
}
