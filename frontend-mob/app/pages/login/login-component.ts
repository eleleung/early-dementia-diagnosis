import {Component, OnInit, Inject} from "@angular/core";
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
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
    registerForm: FormGroup;
    emailControl: AbstractControl;
    email = '';

    birthDate;
    carer: Carer;
    isLoggingIn = true;
    isDateButtonVisible = false;
    isDatePickerVisible = false;

    constructor(private loginService: LoginService, private registerService: RegisterService,
                private page: Page, @Inject(FormBuilder) formBuilder: FormBuilder, private routerExtensions: RouterExtensions) {
        this.carer = new Carer();
        this.registerForm = formBuilder.group({
            email: ['', [Validators.required, Validators.minLength(5)]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            dateOfBirth: ['', Validators.required]
        });
        this.emailControl = this.registerForm.controls['email'];
    }

    ngOnInit() {
        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = 1980;
        datePicker.month = 2;
        datePicker.day = 9;
        datePicker.minDate = new Date(1975, 0, 29);
        datePicker.maxDate = new Date(2045, 4, 12);
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

    submit() {
        if (this.isLoggingIn) {
            if (this.carer.email != null || this.carer.password != null) {
                this.login();
            } else {
                alert("Please enter in email and password");
            }
        } else {
            if (this.carer.email != null || this.carer.password != null || this.carer.firstname != null || this.carer.lastname
                != null) {
                this.register();
            } else {
                alert("Please fill in details");
            }
        }
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    login() {
        this.loginService.login(this.carer).subscribe(
            (result) => this.loginSuccess(result),
            (error) => this.onGetDataError(error)
        )
    }

    loginSuccess(result) {
        // console.log(result);
        // applicationSettings.setString("token", JSON.parse(result));
        // console.log(applicationSettings.getString("token"));
        this.routerExtensions.navigate(["/home"]), {clearHistory: true};
    }

    register() {
        this.registerService.registerCarer(this.carer).subscribe(
            (result) => this.registerSuccess(),
            (error) => this.onGetDataError(error)
        )
    }

    registerSuccess() {
        this.routerExtensions.navigate(["/home"]), {clearHistory: true};
    }

    onGetDataError(error: Response | any) {
        const body = error.json() || "";
        const err = body.error || JSON.stringify(body);
        console.log("onGetDataError: " + err);
    }
}
