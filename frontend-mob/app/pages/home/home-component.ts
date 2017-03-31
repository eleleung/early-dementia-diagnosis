/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component} from "@angular/core";

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html",
    styleUrls: ["pages/home/home-common.css"]
})
export class HomeComponent {
    constructor() {
    }

    public page: string;

    goHome() {
        this.page = "home";
    }

    goListOfRecordings() {
        this.page = "listOfRecordings";
    }

    goPatientTests() {
        this.page = "patientTests";
    }

    goSettings() {
        this.page = "settings";
    }
}