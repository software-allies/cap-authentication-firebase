import { Component, OnInit , ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'cap-profile-firebase',
  template: `
<div class="box">
  <div>
    <div class="form-content" *ngIf="userAuth">
      <form *ngIf="userDB && updateUser" [formGroup]="profileUserForm" (ngSubmit)="editProfile()">
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
              />
            </div>


            <div *ngIf="userUpdated" class="form-control-feeback mb-2 text-success text-center">
              user updated successfully
            </div>

            <div *ngIf="errorUpdate" class="form-control-feeback mb-2 text-danger text-center">
              Error updating information, try again later
            </div>

            <button type="submit" class="btn btn-info btn-block btnSubmit mb-3">
              Save
            </button>

            <button (click)="changeView(true)" class="btn btn-info btn-block btnSubmit">
              Cancel
            </button>

            <label *ngIf="passwordUpdatedError" class="col-12 text-danger text-center col-form-label">
              an error occurred with the server when checking your email, try again later
            </label>

          </div>
        </div>
      </form>


      <form *ngIf="!userDB && updateUser && firebaseUser" [formGroup]="profileFirebaseUserForm" (ngSubmit)="editProfileFirebase()">
        <div class="row">
          <div class="col-12">

            <div class="form-group">
              <small class="form-text">
                Full Name
              </small>
              <input
                type="text"
                class="form-control"
                formControlName="displayName"
                [ngClass]="{
                  'invalidField':(!profileFirebaseUserForm.get('displayName').valid)
                  || (validatedForm && !profileFirebaseUserForm.get('displayName').valid)
                }"
              />
              <small *ngIf="!profileFirebaseUserForm.get('displayName').valid && validatedForm" [ngStyle]="{'color':'#dc3545'}" class="form-text">
                  Required field
              </small>
            </div>

            <div *ngIf="userUpdated" class="form-control-feeback mb-2 text-success text-center">
              user updated successfully
            </div>

            <div *ngIf="errorUpdate" class="form-control-feeback mb-2 text-danger text-center">
              Error updating information, try again later
            </div>

            <button type="submit" class="btn btn-info btn-block btnSubmit mb-3">
              Save
            </button>

            <button (click)="changeView(true)" class="btn btn-info btn-block btnSubmit">
              Cancel
            </button>

          </div>
        </div>
      </form>


      <div *ngIf="!updateUser" class="row mt-3 mb-3">
        <div class="col-12">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"> Email: {{userAuth.email}}</li>

            <li *ngIf="userDB" class="list-group-item"> First Name: {{userDB.FirstName}}</li>
            <li *ngIf="userDB" class="list-group-item"> Last Name: {{userDB.LastName}}</li>
            <li *ngIf="userDB" class="list-group-item"> Company: {{userDB.Company}}</li>

            <li *ngIf="!userDB" class="list-group-item"> Full Name: {{userAuth.displayName}}</li>
            <li class="list-group-item"> Verified Email: {{userAuth.emailVerified ? 'Yes' : 'No'}}</li>
            <li class="list-group-item"> Creation Date: {{userAuth.metadata.creationTime | date:'medium'}}</li>
            <li class="list-group-item"> Last SignIn: {{userAuth.metadata.lastSignInTime | date:'medium'}}</li>
          </ul>

          <button (click)="changeView()" type="submit" class="btn btn-success btn-block btnSubmit">
            Edit Profile
          </button>

        </div>
      </div>

      <div *ngIf="!updateUser" class="row">
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
          <div class="col-12 mb-5 text-center">
            <button *ngIf="!emailSend" type="submit" (click)="emailToVerifySent()" class="btn btn-success btn-block btnSubmit">Send verification email</button>
            <button *ngIf="emailSend" type="button" (click)="goToHome()" class="btn btn-default btn-block btnSubmit">Go to Home</button>
          </div>

          <label class="col-12 text-center col-form-label">
            Weather the account have been verified, please click the button.
          </label>
          <div class="col-12 text-center">
            <button type="button" (click)="VerifiedAccount()" class="btn btn-success btn-block btnSubmit"> Verified Account </button>
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
  profileFirebaseUserForm: FormGroup;
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

  updateUser: boolean;
  firebaseUser: boolean;

  authenticationServiceErrorMessage = 'A problem has occurred while establishing communication with the authentication service';
  serviceErrorBackEndMessage = 'A problem has occurred while establishing communication with the BackEnd';

  @Output() userProfileData = new EventEmitter();
  @Output() userProfileUpdate = new EventEmitter();
  @Output() userProfileError = new EventEmitter();

  @Output() userProfileDataBase = new EventEmitter();
  @Output() userProfileDataBaseUpdate = new EventEmitter();
  @Output() userProfileDataBaseUpdateError = new EventEmitter();
  @Output() userProfileDataBaseError = new EventEmitter();

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
    this.updateUser = false;
    this.firebaseUser = false;
  }

  ngOnInit() {
    this.getProfile();
  }

  changeView(resetForm: boolean = false) {
    this.passwordUpdated = false;
    this.passwordUpdatedError = false;
    this.updateUser = !this.updateUser;
    if (resetForm) {
      if (this.userDB) {
        this.profileUserForm = new FormGroup({
          firstname: new FormControl (this.userDB.FirstName, [Validators.required]),
          lastname: new FormControl (this.userDB.LastName , [Validators.required]),
          company: new FormControl (this.userDB.Company)
        });
      } else if (this.userAuth) {
        this.profileFirebaseUserForm = new FormGroup({
          displayName: new FormControl (this.userAuth.displayName, [Validators.required]),
        });
      }
    }
  }

  emailToVerifySent() {
    this.authenticationService.verifyEmail();
    this.emailSend = true;
  }

  VerifiedAccount() {
    window.location.reload();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

   getProfile() {
    this.authenticationService.currentUser.subscribe((user: any)  =>  {
      this.userProfileData.emit(user);
      if (user) {
        if (user.emailVerified) {
          this.userAuth = user;
          if (this.authenticationService.ApiToConsult()) {
            this.authenticationService.getUserFromAPI(user.uid).subscribe((User: any) => {
              this.userProfileDataBase.emit(User);
              this.userDB = User;
              this.profileUserForm = new FormGroup({
                firstname: new FormControl (User.FirstName, [Validators.required]),
                lastname: new FormControl (User.LastName , [Validators.required]),
                company: new FormControl (User.Company)
              });
            }, (error: any) => {
              console.log('Error ' + error.status + ': ' + this.serviceErrorBackEndMessage);
              this.userProfileDataBaseError.emit(error);
            });
          }
          if (!this.userDB) {
            this.firebaseUser = true;
            this.profileFirebaseUserForm = new FormGroup({
              displayName: new FormControl (user.displayName, [Validators.required]),
            });
          }
        } else {
          this.verifiedUser = true;
        }
      } else {
        this.authenticationService.signOutAndGoto('/auth/login');
      }

    }, (error: any) => {
      console.log('Error ' + error.status + ': ' + this.authenticationServiceErrorMessage);
      this.userProfileError.emit(error);
    });
  }

  editProfile() {
    if (this.profileUserForm.valid) {
      this.authenticationService.updateProfileFromAPI(this.userDB.id, this.profileUserForm.value).subscribe((userupdated: any) => {
        this.userProfileDataBaseUpdate.emit(userupdated);
        this.userDB = userupdated;
        this.userUpdated = true;
        setTimeout(() => {
          this.userUpdated = false;
          this.changeView();
        }, 1000);
      }, (error: any) => {
        this.errorUpdate = true;
        setTimeout(() => {
          this.errorUpdate = false;
        }, 1000);
        console.log('Error ' + error.status + ': ' + this.serviceErrorBackEndMessage);
        this.userProfileDataBaseUpdateError.emit(error);
      });
    } else {
      this.validatedForm = true;
    }
  }

  editProfileFirebase() {
    if (this.profileFirebaseUserForm.valid) {
      this.authenticationService.updateProfile(this.profileFirebaseUserForm.value).then((user: any) => {
        this.userUpdated = true;
        setTimeout(() => {
          this.userUpdated = false;
          this.changeView();
        }, 1000);
      }).catch((error: any) => {
        this.errorUpdate = true;
        setTimeout(() => {
          this.errorUpdate = false;
        }, 1000);
        console.log('Error ' + error.status + ': ' + this.authenticationServiceErrorMessage);
      });
    }
  }

  changePassword(email: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `If you want to accept, you will automatically log out for security`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I agree'
    }).then((result) => {
      if (result.value) {
        this.authenticationService.changePassword(email).then(() => {
          Swal.fire(
            'Succes!',
            'An e-mail was sent to your email address that you provided, there you can verify your email.',
            'success'
          );
          this.authenticationService.signOut();
        }).catch(() => Swal.fire('Error!', 'An error occurred with the server when checking your email, try again later.', 'error'));
      }
    });
  }
}
