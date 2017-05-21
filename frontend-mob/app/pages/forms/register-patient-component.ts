/**
 * Created by EleanorLeung on 23/04/2017.
 */
import {Component, ViewChild, ElementRef, Inject, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {FormGroup, AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {Patient} from "../../models/patient";
import {RouterExtensions} from "nativescript-angular";
import {Page} from "ui/page";
import {TextField} from "ui/text-field";
import {DatePicker} from "ui/date-picker";
import {RegisterService} from "../../services/register-service";
import {SegmentedBarItem} from "ui/segmented-bar";
import {Router} from "@angular/router";
import {CarerService} from "../../services/carer.service";

@Component({
    selector: "register-patient-form",
    styleUrls: ["./pages/forms/register-patient-common.css"],
    templateUrl: "./pages/forms/register-patient-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegisterPatientFormComponent implements OnInit {
    registerPatientForm: FormGroup;
    userFirstNameControl: AbstractControl;
    userLastNameControl: AbstractControl;

    patient: Patient;
    public genderOptions: Array<SegmentedBarItem>;

    error: string;
    isAuthenticating: boolean;

    @ViewChild("firstName") firstName: ElementRef;
    @ViewChild("lastName") lastName: ElementRef;
    @ViewChild("dateOfBirth") dateOfBirth: ElementRef;

    constructor(private routerExtensions: RouterExtensions, private page: Page,
                @Inject(FormBuilder) formBuilder: FormBuilder, private registerService: RegisterService,
                private carerService: CarerService, private router: Router) {
        this.page.actionBarHidden = false;
        this.genderOptions = [];

        this.registerPatientForm = formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required]
        });
        this.userFirstNameControl = this.registerPatientForm.controls['firstName'];
        this.userLastNameControl = this.registerPatientForm.controls['lastName'];
        this.patient = new Patient();

        let femaleSegmentedBar: SegmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
        let maleSegmentedBar: SegmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
        femaleSegmentedBar.title = "Female";
        maleSegmentedBar.title = "Male";
        this.genderOptions.push(femaleSegmentedBar, maleSegmentedBar);
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

    public onChange(value) {
        value == 0 ? this.patient.gender = "Female" : this.patient.gender = "Male";
    }

    submit() {
        this.isAuthenticating = true;
        this.patient.firstName = this.userFirstNameControl.value;
        this.patient.lastName = this.userLastNameControl.value;

        let datePicker = this.page.getViewById<DatePicker>("datePicker");
        this.patient.dateOfBirth = new Date(datePicker.year, datePicker.month - 1, datePicker.day);

        this.registerService.registerPatient(this.patient).subscribe(
            (result) => {
                this.isAuthenticating = false;
                this.registerSuccess();
            },
            (error) => {
                alert("here");
                this.isAuthenticating = false;
                this.error = "Error with registering patient";
            }
        )
    }

    registerSuccess() {
        this.carerService.selectedPatient = this.patient;

        this.routerExtensions.navigate(["/home"], {clearHistory: true});
        // this.router.navigate(["home"]);
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