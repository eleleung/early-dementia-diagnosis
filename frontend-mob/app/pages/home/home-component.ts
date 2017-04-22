/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component, ViewChild} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";
import {RecordingsListComponent} from "../recordings-list/recordings-list-component";
import {SettingsComponent} from "../settings/settings-component";
import {InformationComponent} from "../information/information-component";
import {TNSPlayer} from "nativescript-audio";

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

    start() {
        startRecording()
    }

    stop() {
        stopRecording()
    }

    getFile() {
        getRecordedFile()
    }
}

//Records to a .caf file and saves it on the device

var observable = require("data/observable");
var fs = require('file-system');
var audio = require("nativescript-audio");


var data = new observable.Observable({});
var recorder;

data.set('isRecording', false);

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = data;

    data.set('isRecording', false);
}

/* START RECORDING */

function startRecording() {
    // you should check if the device has recording capabilities
    if (audio.TNSRecorder.CAN_RECORD()) {

        recorder = new audio.TNSRecorder();

        //var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
        var audioFolder = "/Users/caitlinwoods/Deskop";

        var recorderOptions = {

            //filename: audioFolder.path + '/recording.caf',
            filename: audioFolder + '/recording.caf',
            infoCallback: function () {
                console.log('infoCallback');
            },
            errorCallback: function () {
                console.log('errorCallback');
                alert('Error recording.');
            }
        };

        console.log('RECORDER OPTIONS: ' + recorderOptions);

        recorder.start(recorderOptions).then(function (res) {
            data.set('isRecording', true);
        }, function (err) {
            data.set('isRecording', false);
            console.log('ERROR: ' + err);
        });

    } else {
        alert('This device cannot record audio.');
    }
}



/* STOP RECORDING */

function stopRecording() {
    if (recorder != undefined) {
        recorder.stop().then(function () {
            data.set('isRecording', false);
            alert('Audio Recorded Successfully.');
        }, function (err) {
            console.log(err);
            data.set('isRecording', false);
        });
    }
}


function getRecordedFile() {
    try {
        var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
        var recordedFile = audioFolder.getFile('recording.caf');
        console.log(recordedFile.path);
        data.set("recordedAudioFile", recordedFile.path);
    } catch (ex) {
        console.log(ex);
    }
}



