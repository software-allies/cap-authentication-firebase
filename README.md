# CAP AUTHENTICATION FIREBASE [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)

**CAP AUTHENTICATION** is a module for **Angular**

* registration
* login
* profile
* change password

you can use one of the most popular google platforms on the market **Firebase**

## **Previous requirements**
**CAP AUTHENTICATION** use bootstrap's classes, You can use a CAP product ([cap-angular-schematic-bootstrap](https://www.npmjs.com/package/cap-angular-schematic-bootstrap)) to configure and install bootstrap to your project the installation is as follows.

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

To use this module go-to the app module and into the sections' import and put the Authentication Module.
```
import { AuthenticationModule } from 'cap-authentication-firebase'
```
---
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
---
*  **Authentication Register**
```
<cap-register-firebase></cap-register-firebase>
```
---
*  **Authentication Profile**
```
<cap-profile-firebase></cap-profile-firebase>
```
---
*  **Authentication Forgot Password**
```
<cap-change-password-firebase></cap-change-password-firebase>
```
---
*  **Authentication Log Out**
```
<cap-log-out-firebase></cap-log-out-firebase>
```

**Note**: An object is stored in the localStorage to know the status of the User.
