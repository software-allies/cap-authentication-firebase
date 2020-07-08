import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cap-log-in-firebase',
  template: `
<div class="box">
  <div>
    <form [formGroup]="loginUserForm" (ngSubmit)="loginUser()">

      <div class="form-group">
        <label for="email">Email address</label>
        <input
          type="text"
          id="email"
          class="form-control"
          [ngClass]="
            {'invalidField':(!loginUserForm.get('email').valid && loginUserForm.get('email').touched)
            || (validatedForm && !loginUserForm.get('email').valid)}"
          formControlName="email"
          aria-describedby="emailHelp"
        />
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          class="form-control"
          [ngClass]="
            {'invalidField':(!loginUserForm.get('password').valid && loginUserForm.get('password').touched)
            || (validatedForm && !loginUserForm.get('password').valid)}"
          formControlName="password"
        />

        <small
          *ngIf="!loginUserForm.get('password').valid && loginUserForm.get('password').touched"
          class="form-text text-center text-muted"
        >
          Your password must be 8-20 characters long, contain letters and numbers and the first letter has to be uppercase.
        </small>

        <div class="form-group form-check">
          <small class="form-text text-right">
            <a href="/auth/forgot-password"> Forgot password? </a>
          </small>
        </div>

        <div *ngIf="userNotValid" class="form-control-feeback text-danger text-center">
          invalid email or password
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Login</button>
      <!--
      <button (click)="signInSocialMedia(false)" type="button" class="btn btnGoogle btn-block">Google</button>
      <button (click)="signInSocialMedia(true)" type="button" class="btn btn-primary btn-block" >Facebook</button>
      -->
    </form>
  </div>
</div>

  `,
  styles: [`
  .box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .box>div {
    height: max-content;
    border-radius: 10px;
    border: 1px solid #f2f2f2;
    padding: 35px;
    width: 450px;
    margin: 40px;
  }

  .btnGoogle
  {
    padding: 1%;
    width: 100%;
    cursor: pointer;
    background: #FF0000;
    color: #fff;
    transition-duration: 0.2s;
  }

  .btnGoogle:hover {
    background-color: rgb(221, 65, 65);
    color: white;
  }

  .invalidField{
    border-color:#dc3545;
  }
  `],
  encapsulation: ViewEncapsulation.Emulated
})
export class AuthLoginComponent implements OnInit {

  loginUserForm: FormGroup;
  userNotValid: boolean;
  socialMedia: boolean;
  validatedForm: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.userNotValid = false;
    this.socialMedia = false;
    this.validatedForm = false;
  }

  ngOnInit() {
    this.loginUserForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginUser() {
    if (this.loginUserForm.valid) {
      this.authenticationService.loginUser(this.loginUserForm.value)
        .then((response: any) => {
        response.user.getIdTokenResult().then((res: any) => {
          this.authenticationService.saveCurrentUSer({
            user: response.user.email.split('@', 1)[0],
            email: response.user.email,
            refresh_token: response.user.refreshToken,
            token: res.token,
            exp: Date.parse(res.expirationTime)
          });
          this.router.navigate(['/']);
        });
        }).catch(error => this.userNotValid = true);
    } else {
      this.validatedForm = true;
    }
  }

  signInSocialMedia(socialMedia: boolean) {
    if (socialMedia) {
      this.authenticationService.authWithFacebook().then((response: any) => {
        response.user.getIdTokenResult().then((res: any) => {
          this.authenticationService.saveCurrentUSer({
            user: response.user.email.split('@', 1)[0],
            email: response.user.email,
            refresh_token: response.user.refreshToken,
            token: res.token,
            exp: Date.parse(res.expirationTime)
          });
        });
      }).catch(() => this.userNotValid = true);
    } else {
      this.authenticationService.authWithGoogle().then((response: any) =>  {
        response.user.getIdTokenResult().then((res: any) => {
          this.authenticationService.saveCurrentUSer({
            user: response.user.email.split('@', 1)[0],
            email: response.user.email,
            refresh_token: response.user.refreshToken,
            token: res.token,
            exp: Date.parse(res.expirationTime)
          });
        });
      }).catch(() => this.userNotValid = true);
    }
    !this.userNotValid ? this.router.navigate(['/']) : false;
  }
}
