/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component, Input, OnChanges, Output, EventEmitter} from "@angular/core";
import {LoginService} from "../../services/login-service";
import {Patient} from "../../models/patient";
import {RouterExtensions} from "nativescript-angular";
// import {SelectedIndexChangedEventData} from "nativescript-drop-down";

@Component({
    selector: "settings",
    templateUrl: "./pages/settings/settings-component.html",
    styleUrls: ["styles/custom.css", "./pages/settings/settings-common.css"]
})
export class SettingsComponent {
    @Input() selectedPatient: Patient;
    @Input() listOfPatients: Array<Patient> = [];

    @Output() onSelectingNewPatient = new EventEmitter<Patient>();

    constructor(private loginService: LoginService, private routerExtensions: RouterExtensions) {

    }

    changeSelectedPatient() {
        if (this.listOfPatients != null) {
            this.selectedPatient = this.listOfPatients[2];
            this.onSelectingNewPatient.emit(this.selectedPatient);
        }
    }

    addPatient() {
        // how to return from this?
        // this.routerExtensions.navigate(["/register-patient-form"]);
    }

    logout() {
        this.loginService.logout();
    }
}