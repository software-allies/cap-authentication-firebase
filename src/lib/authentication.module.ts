import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { CommonModule } from "@angular/common";

import { AuthRegisterComponent } from './components/register/register.component';
import { AuthLoginComponent } from './components/login/login.component';
import { AuthProfileComponent } from './components/profile/profile.component';
import { AuthChangePasswordComponent } from './components/change-password/change-password.component';
import { logOutComponent } from './components/log-out/log-out.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { StateService } from './services/state.service';
import { GuardService } from './services/guard.service';
import { IConfig } from './interfaces/config.interface';
import { ConfigService } from './services/config.service';

@NgModule({
  declarations: [
    AuthLoginComponent,
    AuthRegisterComponent,
    AuthChangePasswordComponent,
    AuthProfileComponent,
    logOutComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    AngularFireAuthModule,
  ],
  exports: [
    AuthLoginComponent,
    AuthRegisterComponent,
    AuthChangePasswordComponent,
    AuthProfileComponent,
    logOutComponent
  ],
  providers: [
    AuthenticationService,
    StateService,
    GuardService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AuthenticationModule {
  static forRoot(config: IConfig): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
      ]
    };
  }

}

