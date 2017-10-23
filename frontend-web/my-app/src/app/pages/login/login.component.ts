import {Component} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoginModel} from "../../models/user";
import {PatientService} from "../../services/patient.service";

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
})

export class LoginComponent {
    private model: LoginModel = new LoginModel();
    messageClass: string = "";
    message: string = "";
    loading: boolean = false;


    constructor (private loginService: LoginService,
                 private patientService: PatientService,
                 private router: Router) {
        window.scrollTo(0,0);
        // if (loginService.checkLogin()) {
        //     userService.redirectLostUser();
        // }
    }

    onSubmit() {
        this.loading = true;
        this.loginService.login(this.model).subscribe(
            (result) => {
                if (result.success) {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("user", result.user);
                    this.loginService.user = result.user;

                    this.model.email = "";
                    this.model.password = "";
                    this.patientService.getPatients();
                    this.router.navigate(['/overview']);
                }
                else {
                    this.messageClass = "error";
                    this.message = "Error with login credentials, please check your email and password";
                }
                this.loading = false;
            },
            (error) => {
                this.messageClass = "error";
                this.message = "Error with login credentials, please check your email and password";
                this.loading = false;
            }
        );
    }

    resetPassword() {
        // this.loading = true;
        // this.loginService.resetPassword(this.model.email).subscribe(
        //     data => {
        //         this.messageClass = "success";
        //         this.message = "An email has been sent with your temporary password";
        //         this.loading = false;
        //     },
        //     error => {
        //         this.messageClass = "error";
        //         this.message = "No user with that email address";
        //         this.loading = false;
        //     }
        // );
    }
}

