import {Component} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {Test} from '../../models/test';
import {ActivatedRoute} from '@angular/router';
import {Patient} from '../../models/patient';
import { MODAL_DIRECTIVES } from 'angular2-semantic-ui';
import {LoginService} from '../../services/login.service';

/**
 * Created by nathanstanley on 25/5/17.
 */

@Component({
    selector: 'patient',
    templateUrl: 'patient.component.html',
})

export class PatientComponent {

    patientTests: Test[];
    userTests: Test[];

    patient: Patient = new Patient();

    assignModal = false;
    modalOptions = {
        'size': 'small',
        'closeable': true
    };

    constructor(private patientService: PatientService, private route: ActivatedRoute, private loginService: LoginService) {
        const id = this.route.snapshot.params['patientId'];
        patientService.getPatientById(id).subscribe(
            data => {
                this.patient = data.patient;
            },
            error => {

            }
        );

        patientService.getPatientTests(id).subscribe(
            data => {
                if (data.tests != null && data.tests.length > 0) {
                    this.patientTests = data.tests;
                    console.log(data);
                }
            },
            error => {

            }
        );

        patientService.getUserTests().subscribe(
            data => {
                this.userTests = [];

                if (data.tests != null && data.tests.length > 0) {
                    for (let i = data.tests.length - 1; i >= 0; i--) {
                        this.userTests.push(data.tests[i]);
                    }
                }
            },
            error => {

            }
        );

        console.log(loginService.user);
    }

    addTest(test: Test) {
        if (!this.patient.tests) {
            this.patient.tests = [];
        }

        this.patient.tests.push(test);

        this.patientService.addPatientTest(this.patient._id, test._id).subscribe(
            data => {
                console.log('success');
            },
            error => {
                console.log('err');
            }
        );
    }

    viewDetails() {
        // TODO: route to details page or show more details somehow
    }
}
