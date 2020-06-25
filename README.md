# CAP AUTHENTICATION FIREBASE [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

**CAP AUTHENTICATION FIREBASE** is a module for **Angular**

* registration
* login
* profile
* change password

you can use one of the most popular google platforms on the market **Firebase**

## **Previous requirements**
**CAP AUTHENTICATION FIREBASE** use bootstrap's classes, You can use a CAP product [cap-angular-schematic-bootstrap](https://www.npmjs.com/package/cap-angular-schematic-bootstrap) to configure and install bootstrap to your project the installation is as follows.

```
ng add cap-angular-schematic-bootstrap@latest 4.0.0 true
```
![Alt text](https://raw.githubusercontent.com/software-allies/cap-angular-schematic-auth-auth0/development/assets/images/cap-angular-schematic-bootstrap.png "cap-angular-schematic-bootstrap")

We will also need **@angular/fire** to use the Firebase services, for this we must have previously created a project on this platform and enabled authentication methods such as **Email/passord**, **Facebook** and **Google**.
```
npm install firebase @angular/fire --save
```

We position ourselves in the **app.module.ts** of our project and configure **AngularFireModule** with the credentials we obtain from the Firebase platform. It will look as follows.


```
import { AngularFireModule } from '@angular/fire';

@NgModule({
  imports: [
    AngularFireModule.initializeApp({
      apiKey: '<your-apiKey>'
      authDomain: '<your-authDomain>'
      databaseURL: '<your-databaseURL>'
      projectId: '<your-projectId>'
      storageBucket: '<your-storageBucket>'
      messagingSenderId: '<your-messagingSenderId>'
      appId: '<your-appId>'
      measurementId: '<your-measurementId>'
    }),
  ],
})
export class AppModule { }
```
---

## Installation
```
npm i cap-authentication-firebase
```
---

## Implementation into a module

To use this module, go to `app.module.ts`, in the import section and import it `AuthenticationModule` with your proper credentials.

```
import { AuthenticationModule } from 'cap-authentication-firebase'
```
into the import section
```
@NgModule({
  imports: [
    ...
      AuthenticationModule.forRoot({
        endPoint: 'https://your-api-domain.com/api/<users>' // can be empty
      }),
    ...
  ],
})
export class AppModule { }
```
---

## HTML tags

*  **Authentication LogIn**
```
<cap-log-in-firebase></cap-log-in-firebase>
```

*  **Authentication Register**
```
<cap-register-firebase></cap-register-firebase>
```

*  **Authentication Profile**
```
<cap-profile-firebase></cap-profile-firebase>
```

*  **Authentication Forgot Password**
```
<cap-change-password-firebase></cap-change-password-firebase>
```

*  **Authentication Log Out**
```
<cap-log-out-firebase></cap-log-out-firebase>
```

## Styles

In order to edit and create classes that affect the components above, a class will have to be overwritten globally! all kinds and styles will have to go in the `src/styles.scss` file. with Pseudo-classes we will be able to modify the styles of the components, the component structure will be illustrated immediately to be able to access with scss each one of the nodes.

You can see an example of how to edit this module with your design [styles.scss](https://github.com/software-allies/cap-authentication-firebase/blob/development/styles.scss).

```
<div class="box">
    <div>
        <form>
        
            <!-- Register -->
            <!-- Login -->
            <!-- Forgot -->
            <div class="form-group">
                <label></label>
                <input class="form-control">
                <small class="form-text text-muted"></small>
            </div>
            <div class="form-group">
                <label></label>
                <input class="form-control">
                <div class="form-control-feeback text-danger text-center">ErrorMessage</div>
            </div>
             <div class="form-group form-check">
                <small class="form-text text-right">
                    <a routerLink="#"> goTo </a>
                </small>
            </div>
            <button type="submit" class="btn btn-primary btn-block"></button>
            <!-- Register -->
            <!-- Login -->
            <!-- Forgot -->
            
            <!-- Profile -->
            <!-- Profile -->
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <small class="form-text"></small>
                        <input class="form-control"/>
                        <small class="form-text"></small>
                    </div>
                    <div class="form-control-feeback mb-2 text-success text-center">
                    </div>
                    <button class="btn btn-info btn-block btnSubmit"></button>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">{{}}</li>
                    </ul>
                </div>
            </div>
            <!-- Profile -->
            <!-- Profile -->
            
        </form>
    </div>
</div>
```

**Note**: An object is stored in the localStorage to know the status of the User.
