import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private _shouldListenShortcut = true;

  constructor() {}

  get shouldListenShortcut(): boolean {
    return this._shouldListenShortcut;
  }

  set shouldListenShortcut(value: boolean) {
    this._shouldListenShortcut = value;
  }
}
