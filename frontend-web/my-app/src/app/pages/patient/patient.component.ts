import {Component} from '@angular/core';
import {PatientService} from '../../services/patient.service';
import {Test} from '../../models/test';
import {ActivatedRoute} from '@angular/router';
import {Patient} from '../../models/patient';
import { MODAL_DIRECTIVES } from 'angular2-semantic-ui';
import {LoginService} from '../../services/login.service';
import 'rxjs/Rx' ;

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
    testResult: any;
    patient: Patient = new Patient();
    pipedDateOfBirth: string;

    assignModal = false;
    completedTestModal = false;
    modalOptions = {
        'size': 'small',
        'closeable': true
    };

    constructor(private patientService: PatientService, private route: ActivatedRoute, private loginService: LoginService) {
        const id = this.route.snapshot.params['patientId'];
        patientService.getPatientById(id).subscribe(
            data => {
                this.patient = data.patient;
                this.pipedDateOfBirth = new Date(this.patient.dateOfBirth).toDateString();

            },
            error => {

            }
        );

        patientService.getPatientTests(id).subscribe(
            data => {
                if (data.tests != null && data.tests.length > 0) {
                    this.patientTests = data.tests;
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

        patientService.getCompletedPatientTests(id).subscribe(
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

        console.log(loginService.user);
    }

    addTest(test: Test) {
        if (!this.patient.tests) {
            this.patient.tests = [];
        }

        this.patient.tests.push(test);

        this.patientService.addPatientTest(this.patient._id, test._id).subscribe(
            data => {
                this.patientTests.push(test);
                console.log('success');
            },
            error => {
                console.log('err');
            }
        );
    }

    openCompletedTestModal(testResult) {
        this.testResult = testResult;
        console.log(this.testResult);

        this.completedTestModal = true;
    }

    closeCompletedTestModal() {
        this.completedTestModal = false;

        this.testResult = null;

    }

    handleComponentTypes(section, index) {
        if (section.type === 'audio') {
            if (this.testResult.componentResults[index]) {
                const transcribedResult = this.testResult.componentResults[index].transcribedString;

                if (transcribedResult && transcribedResult !== '') {
                    const placeholder = 'Transcribed Text: ';
                    return placeholder.concat(transcribedResult);
                }
            }
        } else if (section.type === 'image') {
            return 'Download the raw file to see result';
        }
    };

    handleRawFiles(section, index) {
        if (section.type === 'audio') {
            // play the audio
        } else if (section.type === 'image') {
            const temp = this.testResult.componentResults[index];

            if (temp && temp.filename) {
                this.toDataURL(temp.filename);
            }
        }
    }

    downloadFile() {

    }

    downloadImage(data) {
        const blob = new Blob([data], { type: 'image/png'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    toDataURL(url) {
        return fetch(url)
            .then((response) => {
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                window.open(url);
            });
    }

    viewDetails(data) {
        // TODO: route to details page or show more details somehow
    }
}
