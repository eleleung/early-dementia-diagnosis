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

//Records to a .caf file and saves it on the device
var fs = require('file-system');
var audio = require("nativescript-audio");
var timer = require("timer");

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html",
    styleUrls: ["pages/home/home-common.css", "app.css"]
})

export class HomeComponent {
    @ViewChild(RecordingsListComponent) recordingsListComponent: RecordingsListComponent;
    @ViewChild(SettingsComponent) settingsComponent: SettingsComponent;
    @ViewChild(InformationComponent) informationComponent: InformationComponent;

    recorder: any;
    isRecording: boolean;
    duration: number = 0;
    timerId: number;

    carerPatients: Array<Patient> = [];
    selectedPatient: Patient;

    constructor(private routerExtensions: RouterExtensions, private page: Page,
                private carerService: CarerService) {
        this.page.actionBarHidden = false;

        this.carerService.getCarersPatients().subscribe(
            (result) => {
                this.carerPatients = result.carerPatients;

                // select default patient at random, could allow user to pick default later
                if (this.carerPatients.length > 0) {
                    this.selectedPatient = this.carerPatients[0];
                }
            },
            (error) => {
                console.log(error);
            }
        )
    }

    onSelectingNewPatient(patient: Patient) {
        this.selectedPatient = patient;
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

    startRecording() {
        // you should check if the device has recording capabilities
        if (audio.TNSRecorder.CAN_RECORD()) {

            this.recorder = new audio.TNSRecorder();

            let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
            // let audioFolder = "/Users/nathanstanley/Desktop";

            let recorderOptions = {

                //filename: audioFolder.path + '/recording.caf',
                filename: audioFolder + '/recording_' + new Date().getTime() + '.caf',
                infoCallback: () => {
                    console.log('infoCallback');
                },
                errorCallback: () => {
                    console.log('errorCallback');
                    alert('Error recording.');
                }
            };

            console.log('RECORDER OPTIONS: ' + recorderOptions);

            this.recorder.start(recorderOptions).then(
                (res) => {
                    this.isRecording = true;
                    this.duration = 0;
                    this.timerId = timer.setInterval(() => {
                        if (this.isRecording) {
                            this.duration++;
                        } else {
                            timer.clearInterval(this.timerId);
                        }
                    }, 1000);
                },
                (err) => {
                    this.isRecording = false;
                    console.log('ERROR: ' + err);
                }
            );

        } else {
            alert('This device cannot record audio.');
        }
    }

    stopRecording() {
        timer.clearInterval(this.timerId);
        if (this.recorder != undefined) {
            this.recorder.stop().then(
                (res) => {
                    this.isRecording = false;
                },
                (err) => {
                    this.isRecording = false;
                    console.log(err);
                }
            );
        }
    }

    getFile() {
        try {
            // let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
            // let recordedFile = audioFolder.getFile('recording.caf');
            // console.log(recordedFile.path);
            // this.filePath = recordedFile.path;
        } catch (ex) {
            console.log(ex);
        }
    }

    uploadAudio() {
        // need to implement
    }
}









