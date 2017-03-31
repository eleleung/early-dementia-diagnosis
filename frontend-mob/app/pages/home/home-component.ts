/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component} from "@angular/core";

@Component({
    selector: "home",
    templateUrl: "./pages/home/home-component.html"
})
export class HomeComponent {
    constructor() {
    }

    public color: string;

    onBlue() {
        this.color = "blue";
    }

    onPurple() {
        this.color = "purple";
    }

    onYellow() {
        this.color = "yellow";
    }

    onSettings() {
        this.color = "settings";
    }
}