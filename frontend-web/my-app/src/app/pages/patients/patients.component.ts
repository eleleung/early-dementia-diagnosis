/**
 * Created by nathanstanley on 25/4/17.
 */
import {Component} from '@angular/core';
import {PatientService} from "../../services/patient.service";
import {Patient} from "../../models/patient";
import {Router} from "@angular/router";

@Component({
    selector: 'patients',
    templateUrl: 'patients.component.html',
})

export class PatientsComponent {

    selectedPatient: Patient = new Patient();

    constructor(private patientService: PatientService,
                private router: Router) {
        patientService.getPatients();
    }

    selectPatient(patient: Patient) {
        this.selectedPatient = patient;
    }

}
