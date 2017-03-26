export class Carer {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;

    isValidEmail() {
        var valid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return valid.test(this.email);
    }
}