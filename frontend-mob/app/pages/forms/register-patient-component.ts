/**
 * Created by EleanorLeung on 23/04/2017.
 */
import {Component, ViewChild, ElementRef, Inject, OnInit} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {Patient} from "../../models/patient";
import {RouterExtensions} from "nativescript-angular";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {DatePicker} from "ui/date-picker";

@Component({
    selector: "register-patient-form",
    styleUrls: ["./pages/forms/register-patient-common.css"],
    templateUrl: "./pages/forms/register-patient-component.html"
})

export class RegisterPatientFormComponent implements OnInit {
    registerPatientForm: FormGroup;

    userFirstNameControl: AbstractControl;
    userLastNameControl: AbstractControl;

    patient: Patient;

    error: string;
    isAuthenticating: boolean;

    @ViewChild("firstName") firstName: ElementRef;
    @ViewChild("lastName") lastName: ElementRef;
    @ViewChild("dateOfBirth") dateOfBirth: ElementRef;

    constructor(private routerExtensions: RouterExtensions, private page: Page,
                @Inject(FormBuilder) formBuilder: FormBuilder) {
        this.page.actionBarHidden = false;

        this.registerPatientForm = formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required]
        });
        this.userFirstNameControl = this.registerPatientForm.controls['firstName'];
        this.userLastNameControl = this.registerPatientForm.controls['lastName'];

        this.patient = new Patient();
    }

    ngOnInit() {
        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        datePicker.year = 1980;
        datePicker.month = 2;
        datePicker.day = 9;
        datePicker.minDate = new Date(1900, 0, 29);
        datePicker.maxDate = new Date(2000, 4, 12);

        this.isAuthenticating = false;
    }

    submit() {
        this.isAuthenticating = true;
        this.patient.firstName = this.userFirstNameControl.value;
        this.patient.lastName = this.userLastNameControl.value;

        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        this.patient.dateOfBirth = new Date(datePicker.year, datePicker.month - 1, datePicker.day);

        alert("Backend implementation in-progress");
        this.isAuthenticating = false;
    }

    focusLastName() {
        this.lastName.nativeElement.focus();
    }

    clearTextFieldFocus() {
        let $firstName = this.page.getViewById<TextField>("firstName");
        if ($firstName != null) {
            $firstName.dismissSoftInput();
        }

        let $lastName = this.page.getViewById<TextField>("lastName");
        if ($lastName != null) {
            $lastName.dismissSoftInput();
        }
    }
}