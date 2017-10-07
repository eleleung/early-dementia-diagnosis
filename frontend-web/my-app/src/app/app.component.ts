import {Component, ViewEncapsulation} from '@angular/core';
import {LoginService} from './services/login.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
})

export class AppComponent {
    constructor(private loginService: LoginService) {
    }
}
