import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Patient} from "../../models/patient";
import {CarerService} from "../../services/carer.service";
import {Page} from "ui/page";
import { Observable as RxObservable } from 'rxjs/Observable';
import {RouterExtensions} from "nativescript-angular";

/**
 * Created by EleanorLeung on 19/05/2017.
 */

@Component({
    selector: "patient-list",
    templateUrl: "./pages/settings/patient-list-component.html",
    styleUrls: ["styles/custom.css", "./pages/settings/settings-common.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientListComponent implements OnInit {

    carerPatients: Array<Patient>;
    selectedPatient: Patient;

    constructor(private carerService: CarerService, private page: Page, private routerExtensions: RouterExtensions) {
        this.page.actionBarHidden = false;

        this.carerPatients = this.carerService.patients;
    }

    ngOnInit() {
    }

    isSelectedPatient(patient: Patient) {
    }

    public onItemTap(args) {
        this.carerService.selectedPatient = this.carerPatients[args.index];
        this.routerExtensions.backToPreviousPage();
    }
}