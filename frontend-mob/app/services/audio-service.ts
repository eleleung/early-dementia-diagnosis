/**
 * Created by caitlinwoods on 12/5/17.
 */

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalVariable} from "../global";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import {SecurityService} from "./security.service";

@Injectable()
export class AudioService {

    constructor(private http: Http, private securityService: SecurityService) {
    }

    getTranscription(audio: string) {
        let url = GlobalVariable.BASE_API_URL + "/transcriber/SendAudio";
        let headers = this.securityService.loggedInHeader();
        return this.http.post(url, JSON.stringify(audio), {headers: headers}).map(res => res.json());
    }
}

