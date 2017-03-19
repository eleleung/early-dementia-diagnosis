import {Component} from "@angular/core";
import {AppService} from "./services/app.service";
import {Test} from "./models/test";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My App"></ActionBar>
    <Label *ngIf="test != null" style="text-align:center" [text]='test.message'></Label>  
    `
})
export class AppComponent {

    test: Test;

    constructor(private appService: AppService) {
        this.appService.getTestData().subscribe(
            (result) => this.onGetDataSuccess(result),
            (error) => this.onGetDataError(error)
        );
    }

    private onGetDataSuccess(res) {
        this.test = res;
    }

    private onGetDataError(error: Response | any) {
        const body = error.json() || "";
        const err = body.error || JSON.stringify(body);
        console.log("onGetDataError: " + err);
    }
}
