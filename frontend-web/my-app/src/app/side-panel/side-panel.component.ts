import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {LoginService} from '../services/login.service';

@Component({
    selector: 'side-panel',
    templateUrl: 'side-panel.component.html'
})

export class SidePanelComponent {

    constructor(private loginService: LoginService,
                private router: Router) {

    }

}
