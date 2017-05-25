/**
* Created by EleanorLeung on 25/03/2017.
*/
import {Component} from "@angular/core";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "recordings-list",
    templateUrl: "./pages/recordings-list/recordings-list-component.html",
    styleUrls: ["./pages/recordings-list/recordings-common.css", "styles/custom.css"]
})
export class RecordingsListComponent {

    constructor(private routerExtensions: RouterExtensions) {

    }

    navigateToRecord() {
        this.routerExtensions.navigate(["/recording"]);
    }
}