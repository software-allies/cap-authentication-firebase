import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cap-log-out-firebase',
  template:
    `
    <div class="d-flex justify-content-center">
      <div class="spinner-grow" style="width: 6rem; height: 6rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    `,
  styles: [``],
  encapsulation: ViewEncapsulation.Emulated

})

export class logOutComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.logOutUser();
  }

  ngOnInit() {}

  logOutUser() {
    this.authenticationService.signOut();
    this.router.navigate(['/']);
  }

}
