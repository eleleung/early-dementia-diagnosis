/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component, ViewChild} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {RecordingsListComponent} from "../recordings-list/recordings-list-component";
import {SettingsComponent} from "../settings/settings-component";
import {InformationComponent} from "../information/information-component";
import {Page} from "ui/page";

//Records to a .caf file and saves it on the device
var fs = require('file-system');
var audio = require("nativescript-audio");

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html",
    styleUrls: ["pages/home/home-common.css"]
})
export class HomeComponent {
    @ViewChild(RecordingsListComponent) recordingsListComponent: RecordingsListComponent;
    @ViewChild(SettingsComponent) settingsComponent: SettingsComponent;
    @ViewChild(InformationComponent) informationComponent: InformationComponent;

    recorder: any;

    isRecording: boolean;
    filePath: string;

    constructor(private routerExtensions: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = false;
    }

    public tab: string = "home";

    goHome() {
        this.tab = "home";
    }

    goRecordingsList() {
        this.tab = "recordingsList";
    }

    goInformation() {
        this.tab = "information";
    }

    goSettings() {
        this.tab = "settings";
    }

    /* START RECORDING */
    start() {
        // you should check if the device has recording capabilities
        if (audio.TNSRecorder.CAN_RECORD()) {

            this.recorder = new audio.TNSRecorder();

            let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
            // let audioFolder = "/Users/nathanstanley/Desktop";

            let recorderOptions = {

                //filename: audioFolder.path + '/recording.caf',
                filename: audioFolder + '/recording.caf',
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

    /* STOP RECORDING */
    stop() {
        if (this.recorder != undefined) {
            this.recorder.stop().then(
                () => {
                    this.isRecording = false;
                    alert('Audio Recorded Successfully.');
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
}









