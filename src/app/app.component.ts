import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FIREBASE_GOOGLE_UID } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'flashcard';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const uid = window.localStorage.getItem(FIREBASE_GOOGLE_UID);

    if (!uid) {
      this.router.navigateByUrl('/login');
    }
  }
}
