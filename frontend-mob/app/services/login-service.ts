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
import applicationSettings = require("application-settings");
import {RouterExtensions} from "nativescript-angular";



@Injectable()
export class LoginService {
    
    constructor (private http: Http, private securityService: SecurityService, private routerExtensions: RouterExtensions) {
    }

    login(carer: Carer) {
        let url = GlobalVariable.BASE_API_URL + "/users/authenticate/";
        let headers = this.securityService.loggedOutHeader();
        return this.http.post(url, JSON.stringify(carer), {headers: headers}).map(res => res.json());
    }

    logout() {
        applicationSettings.setString("token", "");
        applicationSettings.setString("user","");
        this.routerExtensions.navigate(["/login"], {clearHistory: true});
    }

    validate() {
        let url = GlobalVariable.BASE_API_URL + "/users/validate/";
        let headers = this.securityService.loggedInHeader();
        return this.http.get(url, {headers: headers}).map(res => res.json());
    }

}