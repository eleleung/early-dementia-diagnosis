/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html",
    styleUrls: ["pages/home/home-common.css"]
})
export class HomeComponent {
    constructor(private routerExtensions: RouterExtensions) {
    }

    public page: string;

    goHome() {
        this.page = "home";
    }

    goRecordingsList() {
        this.page = "recordingsList";
    }

    goInformation() {
        this.page = "information";
    }

    goSettings() {
        this.page = "settings";
    }
}