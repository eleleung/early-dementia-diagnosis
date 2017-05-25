/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component, Input, OnChanges, Output, EventEmitter} from "@angular/core";
import {LoginService} from "../../services/login-service";
import {Patient} from "../../models/patient";
import {RouterExtensions} from "nativescript-angular";

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
        this.routerExtensions.navigate(["/patient-list"]);
    }

    addPatient() {
        this.routerExtensions.navigate(["/register-patient-form"]);
    }

    logout() {
        this.loginService.logout();
    }
}