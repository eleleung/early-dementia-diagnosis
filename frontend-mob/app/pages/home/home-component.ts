/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component, ViewChild, AfterViewInit, Input} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {RecordingsListComponent} from "../recordings-list/recordings-list-component";
import {SettingsComponent} from "../settings/settings-component";
import {InformationComponent} from "../information/information-component";
import {Page} from "ui/page";
import {CarerService} from "../../services/carer.service";
import {Patient} from "../../models/patient";
import {AudioService} from "../../services/audio-service";
import {TNSRecorder} from "nativescript-audio";
import {GlobalVariable} from "../../global";
import * as bghttp from 'nativescript-background-http';
import {Test} from "../../models/test";

var fs = require('file-system');
var audio = require("nativescript-audio");
var timer = require("timer");
var http = require("http");
var session = bghttp.session("image-upload");

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html",
    styleUrls: ["pages/home/home-common.css", "app.css"]
})

export class HomeComponent {
    @ViewChild(RecordingsListComponent) recordingsListComponent: RecordingsListComponent;
    @ViewChild(SettingsComponent) settingsComponent: SettingsComponent;
    @ViewChild(InformationComponent) informationComponent: InformationComponent;

    carerPatients: Array<Patient> = [];
    selectedPatient: Patient;

    constructor(private routerExtensions: RouterExtensions, private page: Page,
                private carerService: CarerService, private  audioService: AudioService) {
        this.page.actionBarHidden = false;

        this.carerService.getCarersPatients();
        console.log(this.carerService.patients);
        this.carerPatients = this.carerService.patients;

    }

    onSelectingNewPatient(patient: Patient) {
        this.carerService.selectedPatient = patient;
    }

    public tab: string = "Home";

    goHome() {
        this.tab = "Home";
    }

    goRecordingsList() {
        this.tab = "My Recordings";
    }

    goInformation() {
        this.tab = "Information";
    }

    goSettings() {
        this.tab = "Settings";
    }

    navigateToRecord() {
        this.routerExtensions.navigate(["/recording"]);
    }
}









