import {Component} from '@angular/core';
import {LoginService} from "./services/login.service";

@Component({
    selector: 'my-app',
    template: `
        <side-panel></side-panel>
        <div id="content-section" [ngClass]="{'right-of-menu': loginService.checkLogin() }">
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
    .right-of-menu {
        margin-left:210px;
    }
    `]
})

export class AppComponent {
    constructor(private loginService: LoginService) {
    }
}
