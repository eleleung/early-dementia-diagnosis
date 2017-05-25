/**
* Created by EleanorLeung on 25/03/2017.
*/
import {Component, OnInit} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {PatientService} from "../../services/patient-service";
import {CarerService} from "../../services/carer.service";
import {Test} from "../../models/test";

@Component({
    selector: "recordings-list",
    templateUrl: "./pages/recordings-list/recordings-list-component.html",
    styleUrls: ["./pages/recordings-list/recordings-common.css", "styles/custom.css"]
})
export class RecordingsListComponent implements OnInit {
    testList: Array<Test> = [];

    constructor(private routerExtensions: RouterExtensions, private patientService: PatientService,
                private carerService: CarerService) {
    }

    ngOnInit() {
        if (this.carerService.selectedPatient != null) {
            this.patientService.getPatientTestsBad(this.carerService.selectedPatient._id).subscribe(
                data => {
                    this.testList = data.tests;
                },
                err => {
                    console.log(err);
                }
            );
        }

    }
}