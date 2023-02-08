import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable, Subject } from 'rxjs';

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
  private flip$ = new Subject<string>();
  private flashcardsRef: AngularFireList<Flashcard>;

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

  flip(face: string): void {
    this.flip$.next(face)
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
