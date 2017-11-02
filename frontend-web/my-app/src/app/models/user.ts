import {Patient} from './patient';

/**
 * Created by nathanstanley on 25/4/17.
 */

export class User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    securityRoles: string[];
    patients: Patient[];
}

export class LoginModel {
    email: string;
    password: string;
}

export class RegisterModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
