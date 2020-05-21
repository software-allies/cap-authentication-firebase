import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: "cap-profile-firebase",
  template: `
<div class="box">
  <div>
    <div class="form-content" *ngIf="user">
      <form [formGroup]="profileUserForm" (ngSubmit)="editProfile()">
        <div class="row">
          <div class="col-12">

            <div class="form-group">
              <small class="form-text">
                Full name
              </small>
              <input
                type="text"
                class="form-control"
                placeholder="Full name *"
                formControlName="displayName"
                [ngClass]="{
                  'invalidField':(!profileUserForm.get('displayName').valid)
                  || (validatedForm && !profileUserForm.get('displayName').valid)
                }"
              />
              <small *ngIf="!profileUserForm.get('displayName').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
                  Required field
              </small>
            </div>


            <div *ngIf="userUpdated" class="form-control-feeback mb-2 text-success text-center">
                user updated successfully
            </div>

            <div *ngIf="errorUpdate" class="form-control-feeback mb-2 text-danger text-center">
                Error updating information, try again later
            </div>

            <button type="submit" class="btn btn-info btn-block btnSubmit">
              Edit Profile
            </button>

            <label *ngIf="passwordUpdated" class="col-12  text-center col-form-label">
              An e-mail was sent to your email address that you provided, there you can change your password.
            </label>
              <label *ngIf="passwordUpdatedError" class="col-12 text-danger text-center col-form-label">
                an error occurred with the server when checking your email, try again later
            </label>

          </div>
        </div>
        <div class="row mt-3 mb-3">
          <div class="col-12">
            <ul class="list-group list-group-flush">
            <li class="list-group-item"> Email : {{user.email}}</li>
            <li class="list-group-item"> Full name: {{user.displayName}}</li>
            <li class="list-group-item"> Authentication Method: {{user.providerData[0].providerId}}</li>
            <li class="list-group-item"> UID User: {{user.providerData[0].uid}}</li>
            <li class="list-group-item"> Verified Email: {{user.emailVerified ? 'Si' : 'No'}}</li>
            <li class="list-group-item"> Creation Date: {{user.metadata.creationTime | date:'medium'}}</li>
            <li class="list-group-item"> Last SignIn : {{user.metadata.lastSignInTime | date:'medium'}}</li>

            </ul>
          </div>
        </div>
      </form>

      <div class="row">
        <div class="col-12">
          <button (click)="changePassword(user.email)" type="submit" class="btn btn-success btn-block btnSubmit">
              Change Password
          </button>
          <label *ngIf="passwordUpdated" class="col-12 text-center col-form-label">
              An e-mail was sent to your email address that you provided, there you can change your password.
          </label>
          <label *ngIf="passwordUpdatedError" class="col-12 text-danger text-center col-form-label">
              An error occurred with the server when checking your email, try again later
          </label>
        </div>
      </div>
    </div>






    <div *ngIf="verifiedUser">
      <div class="form-content">
        <div class="form-group d-flex justify-content-center row text-center">
          <label *ngIf="!emailSend" class="col-12 text-center col-form-label">
            Please verify your Account
          </label>
          <label *ngIf="emailSend" class="col-12 text-center col-form-label">
            An e-mail was sent to your email address that you provided, there you can verify your email.
          </label>
          <label *ngIf="errorEmailSend" class="col-12 text-danger text-center col-form-label">
            An error occurred with the server when checking your email, try again later
          </label>
          <div class="col-12 text-center">
            <button *ngIf="!emailSend" type="submit" (click)="emailToVerifySent()" class="btn btn-success btn-block btnSubmit">Send verification email</button>
            <button *ngIf="emailSend" type="button" (click)="goToHome()" class="btn btn-default btn-block btnSubmit">Go to Home</button>
          </div>
        </div>
      </div>
    </div>
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
    width: 650px;
    margin: 40px;
  }

  .box .list-group-item {
    background-color: transparent;
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
export class AuthProfileComponent implements OnInit {

  profileUserForm: FormGroup;
  userUpdated: boolean;
  user: any;
  errorUpdate: boolean;
  verifiedUser: boolean;
  emailSend: boolean;
  errorEmailSend: boolean;
  validatedForm: boolean;
  passwordUpdated: boolean;
  passwordUpdatedError: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.userUpdated = false;
    this.errorUpdate = false;
    this.verifiedUser = false;
    this.emailSend = false;
    this.errorEmailSend = false;
    this.validatedForm = false;
    this.passwordUpdated = false;
    this.passwordUpdatedError = false;
  }

  ngOnInit() {
    this.getProfile();
  }

  emailToVerifySent() {
    this.authenticationService.verifyEmail();
    this.emailSend = true;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  getProfile() {
    this.authenticationService.currentUser.subscribe((user: any) => {
      if (user) {
        if (user.emailVerified) {
          this.user = user;
          this.profileUserForm = new FormGroup({
            'displayName': new FormControl(user.displayName, [Validators.required])
          });
        } else {
          this.verifiedUser = true;
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  editProfile() {
    if (this.profileUserForm.valid) {
      this.authenticationService.currentUser.subscribe((user: any) => {
        if ( user ) {
          this.authenticationService.updateProfile(this.profileUserForm.value).then((response: any) => {
            this.userUpdated = true;
            setTimeout(() => {
              this.userUpdated = false;
        }, 3000);
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.validatedForm = true;
    }
  }

  changePassword(email: string) {
    this.authenticationService.changePassword(email).then(() => {
      this.passwordUpdated = true;
    }).catch(() => this.passwordUpdatedError = true);
  }
}
