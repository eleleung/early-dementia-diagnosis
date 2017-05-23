/**
 * Created by nathanstanley on 25/4/17.
 */
import {AfterViewInit, Component} from '@angular/core';
import {PatientService} from "../../services/patient.service";
import {Patient} from "../../models/patient";

declare let jquery:any;
declare let $ :any;

@Component({
    selector: 'patients',
    templateUrl: 'patients.component.html',
})

export class PatientsComponent implements AfterViewInit {

    patients: Array<Patient> = [];

    constructor(private patientService: PatientService) {

    }

    ngAfterViewInit() {
        this.patientService.getPatientsServiceMethod();
        console.log(this.patientService.patients);

        this.patientService.getPatients().subscribe(
            data => {
                this.patients = data.carerPatients;

                // hacky, maybe only use this for the demo
                setTimeout(() =>
                    $(document).ready(function() {
                    $('#example').DataTable();
                },100));
            },
            err => {
                console.log(err);
            },
            () => {
                // on complete
            }
        );
    }

    renderDataTable() {
        $(document).ready(function() {
            $('#example').DataTable();
        });
    }
}
