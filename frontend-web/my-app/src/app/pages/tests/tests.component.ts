/**
 * Created by nathanstanley on 25/4/17.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {PatientService} from "../../services/patient.service";
import {Test} from "../../models/test";

@Component({
    selector: 'tests',
    templateUrl: 'tests.component.html',
})

export class TestsComponent {

    tests: Test[];

    constructor(private router: Router, private patientService: PatientService) {
        this.tests = [];

        patientService.getUserTests().subscribe(
            data => {
                this.tests = [];

                if (data.tests != null && data.tests.length > 0) {
                    for (let i = data.tests.length - 1; i >= 0; i--) {
                        this.tests.push(data.tests[i]);
                    }
                }
            },
            error => {
                console.log(error);
            }
        );
    }
}
