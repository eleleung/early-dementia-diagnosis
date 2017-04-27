/**
 * Created by nathanstanley on 21/4/17.
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalVariable} from "../global";
import {Carer} from "../models/carer";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {SecurityService} from "./security.service";

@Injectable()
export class CarerService {

    constructor (private http: Http, private securityService: SecurityService) {
    }

    getProfile() {
        let url = GlobalVariable.BASE_API_URL + "/users/profile/";
        let headers = this.securityService.loggedInHeader();
        return this.http.get(url, {headers: headers}).map(res => res.json());
    }

    getCarersPatients() {
        let url = GlobalVariable.BASE_API_URL + "/users/getPatients";
        let headers = this.securityService.loggedInHeader();
        return this.http.get(url, {headers: headers}).map(res => res.json());
    }
}