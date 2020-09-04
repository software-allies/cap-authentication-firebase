export interface Register {
  userData: UserData;
  response: any;
}

export interface RegisterJWT {
  authTime: Date;
  claims: Claims;
  expirationTime: Date;
  issuedAtTime: Date;
  signInProvider: string;
  token: string;
}

export interface Claims {
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  firebase: any;
  iat: any;
  iss: string;
  sub: string;
  user_id: string;
}

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  profile?: string;
}
