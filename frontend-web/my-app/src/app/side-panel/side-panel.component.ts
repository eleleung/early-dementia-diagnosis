import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {LoginService} from '../services/login.service';
import {User} from "../models/user";

@Component({
    selector: 'side-panel',
    templateUrl: 'side-panel.component.html'
})

export class SidePanelComponent {

    showReferenceModal = false;
    modalOptions = {
        'size': 'small',
        'closeable': true
    };

    constructor(private loginService: LoginService,
                private router: Router) {
    }

}
