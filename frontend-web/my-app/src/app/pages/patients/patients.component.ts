/**
 * Created by nathanstanley on 25/4/17.
 */
import {Component} from '@angular/core';
import {PatientService} from "../../services/patient.service";


@Component({
    selector: 'patients',
    templateUrl: 'patients.component.html',
})

export class PatientsComponent {

    constructor(private patientService: PatientService) {
    }

    // ngAfterViewInit() {
    //     this.patientService.getPatients().subscribe(
    //         data => {
    //             this.patients = data.carerPatients;
    //
    //             // hacky, maybe only use this for the demo
    //             setTimeout(() =>
    //                 $(document).ready(function() {
    //                 $('#example').DataTable();
    //             },100));
    //         },
    //         err => {
    //             console.log(err);
    //         },
    //         () => {
    //             // on complete
    //         }
    //     );

}
