import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: "cap-profile-firebase",
  template: `
  <div class="container register-form">
  <div class="form">
    <div class="header">
        <p>Profile</p>
    </div>
    <div class="form-content" *ngIf="user">
      <form [formGroup]="profileUserForm" (ngSubmit)="editProfile()">
        <div class="row">
          <div class="col-md-6 mb-4">

            <div class="form-group" >
              <small class="form-text">
                Full name
              </small>
              <input  type="text" class="form-control" placeholder="Full name *" formControlName="displayName"
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
            <button type="submit"
                    class="btnSubmit">
                    Edit Profile
            </button>
          </div>
          <div class="col-md-6">
            <div class="ml-5">
              <p> Email : {{user.email}}</p>
              <p> Full name: {{user.displayName}}</p>
              <p> Authentication Method: {{user.providerData[0].providerId}} </p>
              <p> UID User: {{user.providerData[0].uid}} </p>
              <p *ngIf="user.emailVerified"> Verified Email : Yes</p>
              <p *ngIf="!user.emailVerified"> Verified Email : No</p>
              <p> Creation Date: {{user.metadata.creationTime | date:'medium'}}</p>
              <p> Last SignIn : {{user.metadata.lastSignInTime | date:'medium'}}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div *ngIf="verifiedUser">
      <div class="form-content">
        <div class="form-group d-flex justify-content-center row">
          <label *ngIf="!emailSend" class="col-12  text-center col-form-label">
            Please verify your Account
          </label>
          <label *ngIf="emailSend" class="col-12  text-center col-form-label">
            An e-mail was sent to your email address that you provided, there you can verify your email.
          </label>
          <label *ngIf="errorEmailSend" class="col-12 text-danger text-center col-form-label">
              an error occurred with the server when checking your email, try again later
          </label>
          <div class="col-4">
              <button *ngIf="!emailSend" type="submit" (click)="emailToVerifySent()" class="btnSubmit">Send verification email</button>
              <button *ngIf="emailSend" type="button" (click)="goToHome()" class="btnSubmit">Go to Home</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  `,
  styles: [`
  .header
  {
    text-align: center;
    height: 50px;
    background: black;
    color: #fff;
    font-weight: bold;
    line-height: 50px;
  }
  .form-content
  {
    min-height: 150px;
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
    width: 100%;
    cursor: pointer;
    background: black;
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
export class AuthEditComponent implements OnInit{

  profileUserForm: FormGroup;
  userUpdated: boolean;
  user: any;
  errorUpdate: boolean;
  verifiedUser: boolean;
  emailSend: boolean;
  errorEmailSend: boolean;
  validatedForm: boolean;

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
}
