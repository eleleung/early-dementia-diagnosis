import {Component} from "@angular/core";
import {AppService} from "./services/app.service";

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My App"></ActionBar>
  `
})
export class AppComponent {

    constructor(private appService: AppService) {

    }

}
