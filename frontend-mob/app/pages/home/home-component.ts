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

    recorder: any;
    isRecording: boolean;
    duration: number = 0;
    timerId: number;

    carerPatients: Array<Patient> = [];
    selectedPatient: Patient;

    constructor(private routerExtensions: RouterExtensions, private page: Page,
                private carerService: CarerService, private  audioService: AudioService) {
        this.page.actionBarHidden = false;

        this.carerService.getCarersPatients();
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

    startRecording() {
        // you should check if the device has recording capabilities
        if (TNSRecorder.CAN_RECORD()) {

            this.recorder = new TNSRecorder();

            let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
            // let audioFolder = "/Users/EleanorLeung/Desktop";

            let recorderOptions = {
                filename: audioFolder.path + '/testaudio.m4a',

                // filename: audioFolder.path + '/recording.caf',
                infoCallback: () => {
                    console.log('infoCallback');
                },
                errorCallback: () => {
                    console.log('errorCallback');
                    alert('Error recording.');
                },
            };

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
            let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
            let recordedFile = audioFolder.getFile('testaudio.m4a');
            return recordedFile;
        } catch (ex) {
            console.log(ex);
        }
    }

    uploadAudio() {
        let audio = this.getFile();
        this.audioService.getTranscription(audio).subscribe(
            (result) => {
                console.log('success');
                console.log(result.msg);
            },
            (error) => {
                console.log('error');
                console.log(error);
            }
        );
    }

    // sendAudioFile() {
    //     let audio = this.getFile();
    //     let formData = new FormData();
    //     formData.append('file', {
    //         uri: 'file://' ,
    //         name: 'nineteen.m4a',
    //         type: 'audio/m4a',
    //     });
    //     http.request({
    //         url: GlobalVariable.BASE_API_URL + "/transcriber/SendAudioFile",
    //         method: "POST",
    //         headers: {"Content-Type": "audio/MP4A-LATM"},
    //         body: formData
    //     }).then(function(response) {
    //         console.log(response.content);
    //     });
    //     console.log('here');
    // }

    sendAudioFile() {
        let audio = this.getFile();
        let name = "nineteen.m4a";
        let description = "Audio upload";
        let url = GlobalVariable.BASE_API_URL + "/transcriber/SendAudioFile";
        console.log(audio._path);

        let request = {
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/audio",
                "File-Name": name
            },
            description: description
        };
        let task = session.uploadFile(audio._path, request);

        task.on("progress", logEvent);
        task.on("error", logEvent);
        task.on("complete", logEvent);

        function logEvent(e) {
            console.log(e.eventName);
        }
    }

}









