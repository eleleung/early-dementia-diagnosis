/**
 * Created by EleanorLeung on 25/05/2017.
 */

import {Component} from "@angular/core";
import {TNSRecorder} from "nativescript-audio";
import * as bghttp from 'nativescript-background-http';
import {Test} from "../../models/test";
import {GlobalVariable} from "../../global";
import {CarerService} from "../../services/carer.service";
import {AudioService} from "../../services/audio-service";
import {Page} from "ui/page";
import {PatientService} from "../../services/patient-service";

var fs = require('file-system');
var audio = require("nativescript-audio");
var timer = require("timer");
var http = require("http");
var session = bghttp.session("image-upload");

@Component({
    selector: 'recording',
    templateUrl: "./pages/recordings-list/record-component.html",
    styleUrls: ["./pages/recordings-list/recordings-common.css", "styles/custom.css"]
})

export class RecordingComponent {

    recorder: any;
    isRecording: boolean;
    duration: number = 0;
    timerId: number;

    constructor(private carerService: CarerService, private audioService: AudioService,
                private page: Page, private patientService: PatientService) {
        this.page.actionBarHidden = false;

        this.carerService.getCarersPatients();
    }

    startRecording() {
        // you should check if the device has recording capabilities
        if (TNSRecorder.CAN_RECORD()) {

            this.recorder = new TNSRecorder();

            let audioFolder = fs.knownFolders.currentApp().getFolder("audio");
            // let audioFolder = "/Users/EleanorLeung/Desktop";

            let recorderOptions = {
                filename: audioFolder.path + '/frontend.m4a',

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
            let recordedFile = audioFolder.getFile('frontend.m4a');
            return recordedFile;
        } catch (ex) {
            console.log(ex);
        }
    }

    uploadAudio() {
        let audio = this.getFile();
        let test = new Test();
        test.date = new Date();
        test.fileName = audio;
        test.patientId = this.carerService.selectedPatient._id;

        console.dir(test);
        this.audioService.getTranscription(test).subscribe(
            (result) => {
                console.log('success');
                alert("Recording successfully uploaded!");
                this.patientService.getPatientTests(this.carerService.selectedPatient._id);
            },
            (error) => {
                console.log('error');
                console.log(error);
            }
        );
    }

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