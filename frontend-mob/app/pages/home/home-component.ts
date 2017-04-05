/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component, ViewChild} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {RecordingsListComponent} from "../recordings-list/recordings-list-component";
import {SettingsComponent} from "../settings/settings-component";
import {InformationComponent} from "../information/information-component";

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html",
    styleUrls: ["pages/home/home-common.css"]
})
export class HomeComponent {
    @ViewChild(RecordingsListComponent) recordingsListComponent: RecordingsListComponent;
    @ViewChild(SettingsComponent) settingsComponent: SettingsComponent;
    @ViewChild(InformationComponent) informationComponent: InformationComponent;

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