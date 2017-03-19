/**
 * Created by EleanorLeung on 19/03/2017.
 */

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalVariable} from "../global";

import { Observable as RxObservable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class AppService {
    
    constructor (private http: Http) {
    }

    getTestData() {
        let url = GlobalVariable.BASE_API_URL + "/testing/";
        let headers = this.createRequestHeader();
        return this.http.get(url, {headers: headers}).map(res => res.json());
    }

    private createRequestHeader() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }
}

