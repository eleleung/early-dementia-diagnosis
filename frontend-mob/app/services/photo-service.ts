/**
 * Created by caitlinwoods on 18/5/17.
 */


import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {SecurityService} from "./security.service";
import {GlobalVariable} from "../global";

@Injectable()
export class PhotoService {

    constructor(private http: Http, private securityService: SecurityService) {
    }

    uploadPicture(photo: any) {
        let url = GlobalVariable.BASE_API_URL + "/pictures/SendPicture"
        let headers = this.securityService.loggedInHeader();
        return this.http.post(url, JSON.stringify(photo), {headers: headers}).map(res => res.json());
    }
}

