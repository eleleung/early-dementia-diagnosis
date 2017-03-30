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
    userDateOfBirthControl: AbstractControl;

    birthDate: any;
    carer: Carer;
    error: string;
    loginError: boolean = false;
    isLoggingIn = true;
    isAuthenticating: boolean;
    isDateButtonVisible = false;
    isDatePickerVisible = false;

    @ViewChild("email") email: ElementRef;
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;
    @ViewChild("firstName") firstName: ElementRef;
    @ViewChild("lastName") lastName: ElementRef;
    @ViewChild("dateOfBirth") dateOfBirth: ElementRef;


    constructor(private loginService: LoginService, private registerService: RegisterService,
                private page: Page, @Inject(FormBuilder) formBuilder: FormBuilder, private routerExtensions: RouterExtensions) {
        this.carer = new Carer();
        this.loginSignupForm = formBuilder.group({
            email: ['', [Validators.required, Validators.maxLength(60), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]],
            password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern('[A-Za-z,. :0-9/()-_?!]*')]],
            confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            dateOfBirth: ['', Validators.required]
        });
        this.userEmailControl = this.loginSignupForm.controls['email'];
        this.userPasswordControl = this.loginSignupForm.controls['password'];
        this.userConfirmPasswordControl = this.loginSignupForm.controls['confirmPassword'];
        this.userFirstNameControl = this.loginSignupForm.controls['firstName'];
        this.userLastNameControl = this.loginSignupForm.controls['lastName'];
        this.userDateOfBirthControl = this.loginSignupForm.controls['dateOfBirth'];
    }

    ngOnInit() {
        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = 1980;
        datePicker.month = 2;
        datePicker.day = 9;
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);

        this.isLoggingIn = true;
        this.isAuthenticating = false;
    }

    showDatePicker() {
        let textFieldBDate = this.page.getViewById<TextField>("textFieldBDate");
        this.isDateButtonVisible = true;
        this.isDatePickerVisible = true;
    }

    enterDate() {
        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        let selectedDate = new Date(datePicker.year, datePicker.month - 1, datePicker.day);
        this.birthDate = selectedDate;
        this.isDateButtonVisible = false;
        this.isDatePickerVisible = false;
    }

    validateEmail(email: string): boolean {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    submitOrFocusUsername() {
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    submit() {
        if (!this.validateEmail(this.userEmailControl.value)) {
            alert("Enter a valid email address.");
            return;
        }
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
        alert("We will send you an email with instructions to reset your password");
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
                console.log(this.onGetDataError(error));
            }
        )
    }

    loginSuccess(result) {
        applicationSettings.setString("token", result.token);
        this.routerExtensions.navigate(["/home"]), {clearHistory: true};
    }

    register() {
        this.carer.email = this.userEmailControl.value;
        this.carer.password = this.userPasswordControl.value;
        this.carer.confirm_password = this.userConfirmPasswordControl.value;
        this.carer.firstname = this.userFirstNameControl.value;
        this.carer.lastname = this.userLastNameControl.value;
        this.carer.dateOfBirth = this.userDateOfBirthControl.value;

        this.registerService.registerCarer(this.carer).subscribe(
            (result) => {
                this.isAuthenticating = false;
                this.registerSuccess();
            },
            (error) => {
                this.isAuthenticating = false;
                this.onGetDataError(error);
            }
        )
    }

    registerSuccess() {
        this.routerExtensions.navigate(["/home"]), {clearHistory: true};

    }

    onGetDataError(error: Response | any) {
        const body = error.json() || "";
        this.error = body.error || JSON.stringify(body);
        this.error = JSON.parse(this.error).non_field_errors;
        console.log("onGetDataError: " + this.error);
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

    focusDateOfBirth() {
        this.dateOfBirth.nativeElement.focus();
    }
}
