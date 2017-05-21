import {Component, OnInit, Inject, ElementRef, ViewChild} from "@angular/core";
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {RouterExtensions} from "nativescript-angular";

import {DatePicker} from "ui/date-picker";
import {TextField} from "ui/text-field";
import {Page} from "ui/page";

import {LoginService} from "../../services/login-service";
import {RegisterService} from "../../services/register-service";
import {Carer} from "../../models/carer";
import observable = require("data/observable");
import applicationSettings = require("application-settings");
import {CarerService} from "../../services/carer.service";
import {SecurityService} from "../../services/security.service";
import {Router} from "@angular/router";

@Component({
    selector: "login",
    templateUrl: "./pages/login/login-component.html",
    styleUrls: ["pages/login/login-common.css"]
})
export class LoginComponent implements OnInit {
    loginSignupForm: FormGroup;

    userEmailControl: AbstractControl;
    userFirstNameControl: AbstractControl;
    userLastNameControl: AbstractControl;
    userPasswordControl: AbstractControl;
    userConfirmPasswordControl: AbstractControl;

    carer: Carer;

    error: string;
    loginError: boolean = false;
    isLoggingIn = true;
    isAuthenticating: boolean;

    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;
    @ViewChild("firstName") firstName: ElementRef;
    @ViewChild("lastName") lastName: ElementRef;
    @ViewChild("dateOfBirth") dateOfBirth: ElementRef;


    constructor(private loginService: LoginService,
                private registerService: RegisterService,
                private page: Page, @Inject(FormBuilder) formBuilder: FormBuilder,
                private routerExtensions: RouterExtensions,
                private router: Router,
                private carerService: CarerService,
                private securityService: SecurityService) {
        this.page.actionBarHidden = true;

        //Attempt to sign in if the token exists and also skip the tutorial:
        // TODO: currently commented out in order to test tutorial
        if (securityService.isToken()) {
            carerService.getProfile().subscribe(
                (result) => {
                    this.isAuthenticating = false;
                    applicationSettings.setString("user", JSON.stringify(result.user));
                    this.routerExtensions.navigate(["/home"], {clearHistory: true});
                },
                (error) => {
                    //do nothing
                }
            )
        }

        this.carer = new Carer();
        this.loginSignupForm = formBuilder.group({
            email: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]],
            password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern('[A-Za-z,. :0-9/()-_?!]*')]],
            confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required]
        });
        this.userEmailControl = this.loginSignupForm.controls['email'];
        this.userPasswordControl = this.loginSignupForm.controls['password'];
        this.userConfirmPasswordControl = this.loginSignupForm.controls['confirmPassword'];
        this.userFirstNameControl = this.loginSignupForm.controls['firstName'];
        this.userLastNameControl = this.loginSignupForm.controls['lastName'];
    }

    ngOnInit() {
        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = 1980;
        datePicker.month = 2;
        datePicker.day = 9;
        datePicker.minDate = new Date(1900, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);

        this.isLoggingIn = true;
        this.isAuthenticating = false;
    }

    //TODO: put this into the actual form control or don't worry about it
    validateEmail(email: string): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    submit() {
        this.isAuthenticating = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    forgotPassword() {
        //TODO: implement this
        alert("We will send you an email with instructions to reset your password");
        // this.routerExtensions.navigate(["/home"], {clearHistory: true});
    }

    login() {
        this.carer.email = this.userEmailControl.value;
        this.carer.password = this.userPasswordControl.value;
        this.loginService.login(this.carer).subscribe(
            (result) => {
                this.isAuthenticating = false;
                this.loginSuccess(result);
            },
            (error) => {
                this.loginError = true;
                this.isAuthenticating = false;
                this.error = "Invalid username or password";
                this.userPasswordControl.reset();
            }
        )
    }

    loginSuccess(result) {
        applicationSettings.setString("token", result.token);
        applicationSettings.setString("user", JSON.stringify(result.user));

        // run tutorial for first time logging in
        this.routerExtensions.navigate(["/tutorial"], {clearHistory: true});
    }

    register() {
        this.carer.email = this.userEmailControl.value;
        this.carer.password = this.userPasswordControl.value;
        this.carer.confirm_password = this.userConfirmPasswordControl.value;
        this.carer.firstname = this.userFirstNameControl.value;
        this.carer.lastname = this.userLastNameControl.value;

        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        this.carer.dateOfBirth  = new Date(datePicker.year, datePicker.month - 1, datePicker.day);

        this.registerService.registerCarer(this.carer).subscribe(
            (result) => {
                this.isAuthenticating = false;
                this.login();
            },
            (error) => {
                this.isAuthenticating = false;
                this.error = "This email is already taken";
                this.loginError = true;
                this.userEmailControl.reset();
            }
        )
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }

    focusConfirmPassword() {
        this.confirmPassword.nativeElement.focus();
    }

    focusFirstName() {
        this.firstName.nativeElement.focus();
    }

    focusLastName() {
        this.lastName.nativeElement.focus();
    }

    clearTextfieldFocus() {
        this.page.getViewById<TextField>("email").dismissSoftInput();
        this.page.getViewById<TextField>("password").dismissSoftInput();

        let $firstname = this.page.getViewById<TextField>("firstname");
        if ($firstname != null) $firstname.dismissSoftInput();

        let $lastname = this.page.getViewById<TextField>("lastname");
        if ($lastname != null) $lastname.dismissSoftInput();

        let $confirm = this.page.getViewById<TextField>("confirmPassword");
        if ($confirm != null) $confirm.dismissSoftInput();
    }

    getPasswordClass() {
        if (!this.userPasswordControl.valid && this.isLoggingIn && this.loginError) {
            return 'error';
        } else if (this.userPasswordControl.valid) {
            return 'valid';
        }
    }

    getPasswordConfirmedClass() {
        if (this.userConfirmPasswordControl.valid && this.userPasswordControl.value == this.userConfirmPasswordControl.value) {
            return 'valid';
        }
    }
}
