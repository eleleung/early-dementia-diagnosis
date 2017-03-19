/**
 * Created by EleanorLeung on 19/03/2017.
 */

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalVariable} from "../global";

@Injectable()
export class AppService {
    constructor (private http: Http) {}

    getTestData() {
        let url = GlobalVariable.BASE_API_URL + "/testing/";
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.http.get(url, {headers: headers});
    }
}

