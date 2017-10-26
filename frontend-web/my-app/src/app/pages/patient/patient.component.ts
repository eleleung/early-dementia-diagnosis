import {Component} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {Test} from '../../models/test';
import {ActivatedRoute} from '@angular/router';
import {Patient} from '../../models/patient';
import { MODAL_DIRECTIVES } from 'angular2-semantic-ui';
import {LoginService} from '../../services/login.service';
import 'rxjs/Rx' ;
import {GlobalVariable} from "../../globals";
import {TestResultService} from "../../services/test-result.service";
import {TestResult} from "../../models/testResult";
import {DomSanitizer} from "@angular/platform-browser";

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
    testResults: any[];
    testResult: TestResult;
    patient: Patient = new Patient();
    pipedDateOfBirth: string;

    assignModal = false;
    completedTestModal = false;
    modalOptions = {
        'size': 'small',
        'closeable': true
    };

    constructor(private patientService: PatientService, private route: ActivatedRoute,
                private loginService: LoginService, private testResultService: TestResultService,
                private sanitizer: DomSanitizer) {
        const id = this.route.snapshot.params['patientId'];
        this.patientTests = [];
        patientService.getPatientById(id).subscribe(
            data => {
                this.patient = data.patient;
                this.pipedDateOfBirth = new Date(this.patient.dateOfBirth).toDateString();

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

        this.refreshAssignedTests(id);
        this.refreshCompletedTests(id);
    }

    refreshAssignedTests(id) {
        if (!id) {
            id = this.patient._id;
        }
        this.patientService.getPatientTests(id).subscribe(
            data => {
                if (data.tests != null && data.tests.length > 0) {
                    this.patientTests = data.tests;
                }
            },
            error => {

            }
        );
    }

    refreshCompletedTests(id) {
        if (!id) {
            id = this.patient._id;
        }
        this.patientService.getCompletedPatientTests(id).subscribe(
            data => {
                this.testResults = [];
                if (data.testResults != null && data.testResults.length > 0) {
                    for (let i = data.testResults.length - 1; i >= 0; i--) {
                        this.testResults.push(data.testResults[i]);
                    }
                }
                console.log(this.testResults);
            },
            error => {
                console.log(error);
            }
        );
    }

    addTest(test: Test) {
        if (!this.patient.tests) {
            this.patient.tests = [];
        }

        this.patient.tests.push(test);

        this.patientService.addPatientTest(this.patient._id, test._id).subscribe(
            data => {
                this.patientTests.push(test);
                this.assignModal = false;
                console.log('success');
            },
            error => {
                console.log('err');
            }
        );
    }

    openCompletedTestModal(testResult) {
        this.testResult = testResult;
        this.completedTestModal = true;

        for (const component of testResult.componentResults) {
            if (component.type === 'audio') {
                this.testResultService.loadAudio(this.patient._id, component.filename).subscribe(
                    data => {
                        const blob = data.blob();
                        const blobUrl = URL.createObjectURL(blob);

                        component.audioFile = {
                            blob: blob,
                            url: this.sanitizer.bypassSecurityTrustUrl(blobUrl),
                        };
                    },
                    err => {
                    }
                );
            } else if (component.type === 'image') {
                this.testResultService.loadImage(this.patient._id, component.filename).subscribe(
                    data => {
                        const blob = data.blob();
                        const blobUrl = URL.createObjectURL(blob);

                        component.imageFile = {
                            blob: blob,
                            url: this.sanitizer.bypassSecurityTrustUrl(blobUrl),
                        };

                        console.log(component.imageFile);
                    },
                    err => {
                    }
                );
            }
        }
    }

    closeCompletedTestModal() {
        this.completedTestModal = false;
        this.testResult = null;
    }
}
