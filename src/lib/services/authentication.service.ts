import { Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from './config.service';
import { StateService } from './state.service';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

  private user: Observable<firebase.User | null>;

  constructor(
    private configService: ConfigService,
    private stateService: StateService,
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.user = this.afAuth.authState;
    this.stateService.setState('isLogged', this.isUserLoggedIn());
  }

  get authenticated(): boolean {
    return this.user != null;
  }

  get currentUser(): Observable<firebase.User | null> {
    return this.user;
  }

  getExternalID() {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      return JSON.parse(localStorage.getItem('User')).cap_uuid
        ? JSON.parse(localStorage.getItem('User')).cap_uuid
        : null;
    }
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
        this.stateService.setState('isLogged', false);
      }
    }
    this.router.navigate(['/']);
    return this.afAuth.auth.signOut();
  }

  saveCurrentUSer(user: {}) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('User', JSON.stringify(user));
    }
    this.stateService.setState('isLogged', true);
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

  changePassword(email: any): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  verifyEmail(): Promise<void> {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  isUserLoggedIn(): boolean | void {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      const userStorage = JSON.parse(localStorage.getItem('User'));
      if (userStorage.exp > Date.now()) {
        return true;
      } else {
        this.signOut();
        return false;
      }
    } else {
      return false;
    }
  }

  createUserDB(user: any, token: string, authId: string) {
    if (this.configService.endPoint) {
      const uuid = uuidv4();
      const userData = {
        SACAP__UUID__c: uuid,
        FirstName: user.firstName,
        LastName: user.lastName ? user.lastName : '',
        Email: user.email,
        Company: user.company ? user.company : '',
        Type: 'Firebase',
        ExternalId: authId
      };
      const httpOptions = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      };
      return this.http.post(`${this.configService.endPoint}`, userData, httpOptions)
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
            const userStorage = JSON.parse(localStorage.getItem('User'));
            this.saveCurrentUSer({
              user: userStorage.user,
              email: userStorage.email,
              refresh_token: userStorage.refresh_token,
              token: userStorage.token,
              token_id: userStorage.token_id,
              cap_uuid: uuid,
              exp: userStorage.exp
            });
        }
        console.log('user created successfully.');
      },
        (error) => {
          console.log(error);
      });
    }
  }

  getUserFromAPI(id: string) {
    if (this.configService.endPoint) {
      const url = `${this.configService.endPoint}/findOne?filter={"where":{"ExternalId":"${id}"}}`;
      const httpOptions = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`
        })
      };
      return this.http.get(url, httpOptions);
    }
  }

  updateProfileFromAPI(id: string, data: any) {
    if (this.ApiToConsult()) {
      const httpOptions = {
        headers : new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getToken()}`
        })
      };
      return this.http.patch(
        `${this.configService.endPoint}/${id}`,
        {
          FirstName: data.firstname,
          LastName: data.lastname,
          Company: data.company
        },
        httpOptions);
    }
  }

  getToken(): string {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('User')) {
      return JSON.parse(localStorage.getItem('User')).token;
    }
    return '';
  }

  ApiToConsult(): boolean {
    return this.configService.endPoint ? true : false;
  }
}
