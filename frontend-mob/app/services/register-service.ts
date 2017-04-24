/**
 * Created by EleanorLeung on 19/03/2017.
 */

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalVariable} from "../global";
import {Carer} from "../models/carer";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {SecurityService} from "./security.service";
import {Patient} from "../models/patient";
import applicationSettings = require("application-settings");

@Injectable()
export class RegisterService {
    
    constructor (private http: Http, private securityService: SecurityService) {
    }

    registerCarer(carer: Carer) {
        let url = GlobalVariable.BASE_API_URL + "/users/register";
        let headers = this.securityService.loggedOutHeader();
        return this.http.post(url, JSON.stringify(carer), {headers: headers}).map(res => res.json());
    }

    registerPatient(patient: Patient) {
        let url = GlobalVariable.BASE_API_URL + "/patients/register";
        let headers = this.securityService.loggedInHeader();
        return this.http.post(url, JSON.stringify(patient), {headers: headers}).map(res => res.json());
    }
}