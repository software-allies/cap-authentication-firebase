import { Component, ViewEncapsulation, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Register, RegisterJWT } from '../../interfaces/authentication.interface';

@Component({
  selector: "cap-register-firebase",
  template: `
  <div class="box">
    <div>
      <form [formGroup]="createUserForm" (ngSubmit)="createUser()">

        <div class="form-group">
          <label for="email">Email address <span>*</span></label>
          <input
            type="text"
            id="email"
            email
            class="form-control"
            [ngClass]="{
              'invalidField':
                (!createUserForm.get('email').valid && createUserForm.get('email').touched)
                || (validatedForm && !createUserForm.get('email').valid || existingUser),
              'is-valid':createUserForm.get('email').valid
            }"
            formControlName="email"
            aria-describedby="emailHelp"/>
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          <small *ngIf="!createUserForm.get('email').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
            Required field
          </small>
        </div>

        <div class="form-group">
          <label for="password">Password <span>*</span></label>
          <input
            type="password"
            id="password"
            class="form-control"
            [ngClass]="{
              'invalidField':
                (!createUserForm.get('password').valid && createUserForm.get('password').touched)
                || (validatedForm && !createUserForm.get('password').valid),
              'is-valid':!createUserForm.get('password').errors?.capitalLetter && createUserForm.get('password').valid
            }"
            formControlName="password"/>
            <small
              *ngIf="!createUserForm.get('password').pristine && !createUserForm.get('password').valid"
              class="form-text text-center text-muted"
            >
              Your password must contain the following: 8-20 characters long, the first character must be capital (uppercase) letter, a numbers and a lowercase letter.
            </small>
            <small *ngIf="!createUserForm.get('password').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
              Required field
            </small>
        </div>

        <div class="form-group">
          <label for="text">First Name <span>*</span></label>
          <input  type="text"
                  class="form-control"
                  [ngClass]="{
                    'invalidField':
                      (!createUserForm.get('firstName').valid && createUserForm.get('firstName').touched)
                      || (validatedForm && !createUserForm.get('firstName').valid),
                    'is-valid':createUserForm.get('firstName').valid
                  }"
                  formControlName="firstName"/>
          <small *ngIf="!createUserForm.get('firstName').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
            Required field
          </small>
        </div>

        <div class="form-group">
          <label for="text">Last Name <span>*</span></label>
          <input  type="text"
                  class="form-control"
                  [ngClass]="{
                    'invalidField':
                      (!createUserForm.get('lastName').valid && createUserForm.get('lastName').touched)
                      || (validatedForm && !createUserForm.get('lastName').valid),
                    'is-valid':createUserForm.get('lastName').valid
                  }"
                  formControlName="lastName"/>
          <small *ngIf="!createUserForm.get('lastName').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
            Required field
          </small>
        </div>

        <div class="form-group">
          <label for="text">Company</label>
          <input  type="text"
                  class="form-control"
                  formControlName="company"/>
        </div>

        <div *ngIf="existingUser"  class="form-control-feeback text-danger text-center">
          An Account with this username already exists.
        </div>

        <button type="submit" class="btn btn-primary btn-block">Sign Up</button>

        <!--
        <button (click)="signUpSocialMedia(false)" type="button" class="btn btnGoogle btn-block">Google</button>
        <button (click)="signUpSocialMedia(true)" type="button" class="btn btn-primary btn-block">Facebook</button>
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

  span {
    color: #cb2431;
  }

  .invalidField{
    border-color:#dc3545;
  }
  button {
    outline: none;
  }
  `],
  encapsulation: ViewEncapsulation.Emulated
})
export class AuthRegisterComponent implements OnInit {

  createUserForm: FormGroup;
  existingUser: boolean;
  socialMedia: boolean;
  validatedForm: boolean;

  @Input() redirectTo?: string = '/';
  @Output() userRegisterData = new EventEmitter<Register>();
  @Output() userRegisterJWT = new EventEmitter<RegisterJWT>();
  @Output() userRegisterError = new EventEmitter();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.existingUser = false;
    this.createUserForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), this.capitalLetter]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      company: new FormControl('')
    });
    this.socialMedia = false;
    this.validatedForm = false;
  }

  ngOnInit() { }

  capitalLetter(control: FormControl): { [s: string]: boolean } {
    const letterAscii = control.value.charCodeAt(0);
    if (control.value && letterAscii > 64 && letterAscii < 91) {
      return null;
    }
    return {
      capitalLetter: true
    };
  }

  createUser() {
    if (this.createUserForm.valid) {
      this.authenticationService.createUser(this.createUserForm.value)
      .then((response: any) => {
        this.userRegisterData.emit({
          userData: this.createUserForm.value,
          response
        });
        response.user.getIdTokenResult().then((res: any) => {
          this.authenticationService.saveCurrentUSer({
            user: response.user.email.split('@', 1)[0],
            email: response.user.email,
            refresh_token: response.user.refreshToken,
            token: res.token,
            exp: Date.parse(res.expirationTime),
          });
          this.userRegisterJWT.emit(res);
          this.authenticationService.createUserDB(this.createUserForm.value, res.token, res.claims.user_id);
        }).then(() => {
          response.user.sendEmailVerification().then(() => this.router.navigate([`${this.redirectTo}`]));
        });
      }).catch((error) => {
        this.existingUser = true;
        this.userRegisterError.emit(error);
      });
    } else {
      this.validatedForm = true;
    }
  }

  signUpSocialMedia(socialMedia: boolean) {
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
        }).then(() => {
          this.authenticationService.createUserDB(
            {
              email: response.user.email,
              firstName: response.user.displayName
            },
            response.user.ma,
            response.user.uid);
        });
      }).catch(() => this.existingUser = true);
    } else {
      this.authenticationService.authWithGoogle().then((response: any) => {
        response.user.getIdTokenResult().then((res: any) => {
          this.authenticationService.saveCurrentUSer({
            user: response.user.email.split('@', 1)[0],
            email: response.user.email,
            refresh_token: response.user.refreshToken,
            token: res.token,
            exp: Date.parse(res.expirationTime)
          });
        }).then(() => {
          this.authenticationService.createUserDB(
            {
              email: response.user.email,
              firstName: response.user.displayName
            },
            response.user.ma,
            response.user.uid);
        });
      }).catch(() => this.existingUser = true);
    }
    !this.existingUser ? this.router.navigate(['/']) : false;
  }
}
