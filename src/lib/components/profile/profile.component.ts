import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: "cap-profile-firebase",
  template: `
<div class="box">
  <div>
    <div class="form-content" *ngIf="userAuth">
      <form *ngIf="userDB" [formGroup]="profileUserForm" (ngSubmit)="editProfile()">
        <div class="row">
          <div class="col-12">

            <div class="form-group">
              <small class="form-text">
                First Name
              </small>
              <input
                type="text"
                class="form-control"
                formControlName="firstname"
                [ngClass]="{
                  'invalidField':(!profileUserForm.get('firstname').valid)
                  || (validatedForm && !profileUserForm.get('firstname').valid)
                }"
              />
              <small *ngIf="!profileUserForm.get('firstname').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
                  Required field
              </small>
            </div>

            <div class="form-group">
              <small class="form-text">
                Last Name
              </small>
              <input
                type="text"
                class="form-control"
                formControlName="lastname"
                [ngClass]="{
                  'invalidField':(!profileUserForm.get('lastname').valid)
                  || (validatedForm && !profileUserForm.get('lastname').valid)
                }"
              />
              <small *ngIf="!profileUserForm.get('lastname').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
                  Required field
              </small>
            </div>

            <div class="form-group">
              <small class="form-text">
                Company
              </small>
              <input
                type="text"
                class="form-control"
                formControlName="company"
                [ngClass]="{
                  'invalidField':(!profileUserForm.get('company').valid)
                  || (validatedForm && !profileUserForm.get('company').valid)
                }"
              />
              <small *ngIf="!profileUserForm.get('company').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
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
      </form>

      <div class="row mt-3 mb-3">
        <div class="col-12">
          <ul class="list-group list-group-flush">
          <li class="list-group-item"> Email : {{userAuth.email}}</li>
          <li class="list-group-item"> Authentication Method: {{userAuth.providerData[0].providerId}}</li>
          <li class="list-group-item"> UID User: {{userAuth.providerData[0].uid}}</li>
          <li class="list-group-item"> Verified Email: {{userAuth.emailVerified ? 'Yes' : 'No'}}</li>
          <li class="list-group-item"> Creation Date: {{userAuth.metadata.creationTime | date:'medium'}}</li>
          <li class="list-group-item"> Last SignIn : {{userAuth.metadata.lastSignInTime | date:'medium'}}</li>

          </ul>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <button (click)="changePassword(userAuth.email)" type="submit" class="btn btn-success btn-block btnSubmit">
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
  emailSend: boolean;

  errorUpdate: boolean;
  errorEmailSend: boolean;

  verifiedUser: boolean;
  validatedForm: boolean;

  userUpdated: boolean;
  userAuth: any;
  userDB: any;

  passwordUpdated: boolean;
  passwordUpdatedError: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.emailSend = false;
    this.userUpdated = false;
    this.errorUpdate = false;
    this.verifiedUser = false;
    this.validatedForm = false;
    this.errorEmailSend = false;
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
    this.authenticationService.currentUser.subscribe(async (user: any)  =>  {
      if (user && user.emailVerified) {
        this.userAuth = user;

        if (this.authenticationService.ApiToConsult()) {
          this.authenticationService.getUserFromAPI(user.uid).subscribe((User: any) => {
            this.userDB = User;
            this.profileUserForm = new FormGroup({
              firstname: new FormControl (User.FirstName, [Validators.required]),
              lastname: new FormControl (User.LastName , [Validators.required]),
              company: new FormControl (User.Company, [Validators.required])
            });
          }, (error: any) => console.log('There was a problem try again refreshing the page.', error));
      }

      } else {
        this.verifiedUser = true;
      }
    }, (error: any) => console.log('Your authentication platform is experiencing problems, try later', error));
  }

  editProfile() {
    if (this.profileUserForm.valid) {
      this.authenticationService.updateProfileFromAPI(this.userDB.id, this.profileUserForm.value).subscribe((userupdated: any) => {
        this.userDB = userupdated;
        this.userUpdated = true;
        setTimeout(() => {
          this.userUpdated = false;
        }, 3000);
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
