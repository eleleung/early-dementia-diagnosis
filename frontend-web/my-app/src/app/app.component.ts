import {Component, ViewEncapsulation} from '@angular/core';
import {LoginService} from './services/login.service';
import {Router} from "@angular/router";

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
})

export class AppComponent {
    constructor(private loginService: LoginService) {
    }
}
