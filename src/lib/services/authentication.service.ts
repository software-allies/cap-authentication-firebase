import { Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthenticationService {

  private user: Observable<firebase.User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    @Inject(PLATFORM_ID) private platformId,
  ) {
    this.user = this.afAuth.authState;
  }

  get authenticated(): boolean {
    return this.user != null;
  }

  get currentUser(): Observable<firebase.User | null> {
    return this.user;
  }

  createUser(user: any): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  loginUser(user: any): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signOut(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('User')) {
        localStorage.removeItem('User');
      }
    }
    return this.afAuth.auth.signOut();
  }

  saveCurrentUSer(user: {}) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('User', JSON.stringify(user));
    }
  }

  authWithFacebook(): Promise<firebase.auth.UserCredential> {
    const provider: firebase.auth.FacebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    return this.afAuth.auth.signInWithPopup(provider);
  }

  authWithGoogle(): Promise<firebase.auth.UserCredential> {
    const provider: firebase.auth.GoogleAuthProvider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  updateProfile = (user: any): Promise<void> =>
    this.afAuth.auth.currentUser
    ? this.afAuth.auth.currentUser.updateProfile({
      displayName: user.displayName
    })
    : Promise.resolve()

  changePassword(user: any): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(user.email);
  }

  verifyEmail(): Promise<void> {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  isUserLoggedIn(): boolean | void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      let userStorage = JSON.parse(localStorage.getItem('User'));
      if (this.afAuth.auth.currentUser && userStorage) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}
