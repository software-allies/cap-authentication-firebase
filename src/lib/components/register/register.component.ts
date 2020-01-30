import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: "cap-register-firebase",
  template: `
  <div class="container register-form">
  <div class="form">
    <div class="header">
        <p>Create your account</p>
    </div>
    <div class="form-content">

      <form [formGroup]="createUserForm" (ngSubmit)="createUser()">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group" >
                <input  type="text"
                        class="form-control"
                        placeholder="Email address *"
                        [ngClass]="{
                          'invalidField':
                            (!createUserForm.get('email').valid && createUserForm.get('email').touched)
                            || (validatedForm && !createUserForm.get('email').valid),
                          'is-valid':createUserForm.get('email').valid
                        }"
                        formControlName="email"/>
              <small *ngIf="!createUserForm.get('email').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
                Required field
              </small>
            </div>
            <div class="form-group">
              <input  type="password"
                      class="form-control"
                      placeholder="Password *"
                      [ngClass]="{
                        'invalidField':
                          (!createUserForm.get('password').valid && createUserForm.get('password').touched)
                          || (validatedForm && !createUserForm.get('password').valid),
                        'is-valid':!createUserForm.get('password').errors?.capitalLetter && createUserForm.get('password').valid
                      }"
                      formControlName="password"/>
              <small *ngIf="!createUserForm.get('password').pristine && !createUserForm.get('password').valid" class="form-text text-center text-muted">
                Your password must contain the following: 8-20 characters long, the first character must be capital (uppercase) letter, a numbers and a lowercase letter.
              </small>
              <small *ngIf="!createUserForm.get('password').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
                Required field
              </small>
            </div>
            <div class="form-group">
              <input  type="text"
                      class="form-control"
                      placeholder="First Name * "
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
              <div *ngIf="existingUser"  class="form-control-feeback text-danger text-center">
                This user already exists, try other alternate data
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <input  type="text"
                      class="form-control"
                      placeholder="Last Name *"
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
              <input  type="text"
                      class="form-control"
                      placeholder="Company"/>
            </div>

            <div class="form-group">
              <button type="submit"
                      class="btnSubmit"
                      >Sign Up</button>
              <button (click)="signUpSocialMedia(true)" type="button" class="btnFacebook ">Facebook</button>
              <button (click)="signUpSocialMedia(false)" type="button" class="btnGoogle ">Google</button>
            </div>
            <div *ngIf="socialMedia"  class="form-control-feeback text-danger text-center">
              At the moment authentication with Social networks is under development, try by Email
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

  `,
  styles: [`
  .header
  {
    text-align: center;
    height: 80px;
    background: black;
    color: #fff;
    font-weight: bold;
    line-height: 80px;
  }
  .form-content
  {
    padding: 5%;
    border: 1px solid #ced4da;
    margin-bottom: 2%;
  }
  .form-control{
    border-radius:1.5rem;
  }
  .btnSubmit
  {
    border:none;
    border-radius:1.5rem;
    padding: 1%;
    width: 33%;
    cursor: pointer;
    background: black;
    color: #fff;
  }
  .btnFacebook
  {
    border:none;
    border-radius:1.5rem;
    padding: 1%;
    width: 33%;
    cursor: pointer;
    background: #0000FF;
    color: #fff;
  }
  .btnGoogle
  {
    border:none;
    border-radius:1.5rem;
    padding: 1%;
    width: 33%;
    cursor: pointer;
    background: #FF0000;
    color: #fff;
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

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.existingUser = false;
    this.createUserForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      'password': new FormControl('', [Validators.required, Validators.minLength(8), this.capitalLetter]),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(2)]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(2)]),
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
            response.user.getIdTokenResult().then((res: any) => {
              this.authenticationService.saveCurrentUSer({
                user: response.user.email.split('@', 1)[0],
                email: response.user.email,
                refresh_token: response.user.refreshToken,
                token: res.token
              });
            }).then(() => {
              response.user.sendEmailVerification().then((res: any) => this.router.navigate(['/']));
            });
        }).catch(error => this.existingUser = true);
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
            token: res.token
          });
        }).then(() => {
          this.router.navigate(['/']);
        });
      }).catch(error => this.existingUser = true);
    } else {
      this.authenticationService.authWithGoogle().then((response: any) => {
        response.user.getIdTokenResult().then((res: any) => {
          this.authenticationService.saveCurrentUSer({
            user: response.user.email.split('@', 1)[0],
            email: response.user.email,
            refresh_token: response.user.refreshToken,
            token: res.token
          });
        }).then(() => {
          this.router.navigate(['/']);
        });
      }).catch(error => this.existingUser = true);
    }
  }

}
