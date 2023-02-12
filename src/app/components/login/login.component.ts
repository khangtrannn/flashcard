import { Component, OnInit } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FIREBASE_GOOGLE_UID } from './../../constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private fireAuth: AngularFireAuth, private router: Router) {}

  onLogin(): void {
    this.fireAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((data) => {
        if (data.user?.uid) {
          window.localStorage.setItem(FIREBASE_GOOGLE_UID, data.user.uid);
          this.router.navigateByUrl('/');
        }
      })
      .catch((err) => console.log(err));
  }
}
