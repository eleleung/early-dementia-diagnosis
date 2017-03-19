import {Component} from "@angular/core";
import {AppService} from "./services/app.service";
import {Test} from "./models/test";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My App"></ActionBar>
    <div *ngIf="test != null">{{test.message}}</div>
  `
})
export class AppComponent {

    test: Test;

    constructor(private appService: AppService) {
        this.appService.getTestData().subscribe(
            data => {
                console.log(data);
                this.test = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            },
            error => {
                console.log("error");
                console.log(error);
            }
        )
    }
}
