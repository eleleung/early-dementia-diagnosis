import {Component} from "@angular/core";
import {PatientService} from "../../services/patient.service";
import {Test} from "../../models/test";
import {ActivatedRoute} from "@angular/router";
import {Patient} from "../../models/patient";
/**
 * Created by nathanstanley on 25/5/17.
 */

@Component({
    selector: 'patient',
    templateUrl: 'patient.component.html',
})

export class PatientComponent {

    tests: Test[];

    patient: Patient = new Patient();

    constructor(private patientService: PatientService, private route: ActivatedRoute) {
        let id = this.route.snapshot.params['patientId'];
        patientService.getPatientById(id).subscribe(
            data => {
                this.patient = data.patient;
            },
            error => {

            }
        );

        patientService.getPatientTests(id).subscribe(
            data => {
                this.tests = [];

                if (data.tests != null && data.tests.length > 0) {
                    for (let i = data.tests.length-1; i >= 0; i--) {
                        this.tests.push(data.tests[i]);
                    }
                }
            },
            error => {

            }
        );
    }
}
