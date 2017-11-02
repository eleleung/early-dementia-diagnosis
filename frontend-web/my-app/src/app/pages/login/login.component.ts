import {Component} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoginModel, RegisterModel, User} from '../../models/user';
import {PatientService} from '../../services/patient.service';
import {logging} from "selenium-webdriver";

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
})

export class LoginComponent {
    private model: LoginModel = new LoginModel();
    private registerModel: RegisterModel = new RegisterModel();

    messageClass = '';
    message = '';
    loading = false;
    loggingIn = true;
    confirmPassword = '';

    constructor (private loginService: LoginService,
                 private patientService: PatientService,
                 private router: Router) {
        window.scrollTo(0, 0);
    }

    onLoginSubmit() {
        this.loading = true;
        this.loginService.login(this.model).subscribe(
            (result) => {
                if (result.success) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', result.user);

                    this.loginService.user = result.user;
                    if (result.doctor) {
                        this.loginService.doctor = result.doctor;
                    }

                    this.model.email = '';
                    this.model.password = '';
                    this.patientService.getPatients();
                    this.router.navigate(['/overview']);
                } else {
                    this.messageClass = 'error';
                    this.message = 'Error with login credentials, please check your email and password';
                }
                this.loading = false;
            },
            (error) => {
                this.messageClass = 'error';
                this.message = 'Error with login credentials, please check your email and password';
                this.loading = false;
            }
        );
    }

    onRegisterSubmit() {
        this.loading = true;
        if (this.registerModel.password !== this.confirmPassword) {
            this.messageClass = 'error';
            this.message = 'Make sure your passwords match!';
            this.loading = false;
            return;
        }

        this.loginService.register(this.registerModel).subscribe(
            (result) => {
                if (result.success) {
                    this.messageClass = 'success';
                    this.message = 'Successfully registered. Please login now';

                    this.registerModel.firstName = '';
                    this.registerModel.lastName = '';
                    this.registerModel.password = '';
                    this.registerModel.email = '';
                    this.confirmPassword = '';
                } else {
                    this.messageClass = 'error';
                    this.message = 'Error with registration credentials, please try again';
                }
                this.loading = false;

            },
            (error) => {
                this.messageClass = 'error';
                this.message = 'Error with registration credentials, please try again';
                this.loading = false;
            }
        );
    }

    // TODO: Implement reset password
    resetPassword() {
        // this.loading = true;
        // this.loginService.resetPassword(this.model.email).subscribe(
        //     data => {
        //         this.messageClass = 'success';
        //         this.message = 'An email has been sent with your temporary password';
        //         this.loading = false;
        //     },
        //     error => {
        //         this.messageClass = 'error';
        //         this.message = 'No user with that email address';
        //         this.loading = false;
        //     }
        // );
    }
}

