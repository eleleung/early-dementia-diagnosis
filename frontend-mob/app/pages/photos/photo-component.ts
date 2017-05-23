/**
 * Created by caitlinwoods on 21/5/17.
 */

import * as camera from "nativescript-camera";

import {Component} from "@angular/core";
import {PhotoService} from "../../services/photo-service";

@Component({
    selector: "photo",
    templateUrl: "./pages/photos/photo-component.html"
})

export class PhotoComponent {

    picture: any;

    constructor(private  photoService: PhotoService) {
        this.picture = "https://placehold.it/200x200";

    }

    takePicture() {
        camera.takePicture().then(picture => {
            this.picture = picture;
        }).catch((err) => {
            console.log("Error -> " + err.message);
        });
    }

    uploadPhoto(){
        this.photoService.uploadPicture(this.picture).subscribe(
            (result) => {
                console.log('success')
            },
            (error) => {
                console.log('error');
                console.log(error)
            })

    }
}
