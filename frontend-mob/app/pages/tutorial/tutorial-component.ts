/**
 * Created by EleanorLeung on 1/04/2017.
 */
import {Component} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

import {Page} from "ui/page";

@Component({
    selector: "tutorial",
    styleUrls: ["app.css"],
    templateUrl: "./pages/tutorial/tutorial-component.html"
})

export class TutorialComponent {

    constructor(private routerExtensions: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = false;
    }

    skipTutorial() {
        this.routerExtensions.navigate(["/home"], {clearHistory: true});
    }

    patientForm() {
        this.routerExtensions.navigate(["/register-patient-form"]);
    }
}