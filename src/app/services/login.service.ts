import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth, User } from 'firebase/app';
import { BehaviorSubject, Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  authUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  
  constructor(
    private auth: AngularFireAuth,
    private router: Router  
  ) { }

  loginWithGoogle(): Observable<any>{
    return new Observable((observer: Observer<any>) => {
      this.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then((response: auth.UserCredential) => {
        if (response.user) {
          this.authUser.next(response.user);
          observer.next({});
          observer.complete();
        }
      });
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/landing']);
    });
  }

  getLoggedInUser() {
    return this.authUser.asObservable();
  }
}
