/**
 * Created by EleanorLeung on 25/03/2017.
 */
import {Component} from "@angular/core";
import {LoginService} from "../../services/login-service";

@Component({
    selector: "settings",
    templateUrl: "./pages/settings/settings-component.html"
})
export class SettingsComponent {
    constructor(private loginService: LoginService) {
    }

    logout() {
        this.loginService.logout();
    }
}