/**
 * Created by EleanorLeung on 19/03/2017.
 */

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {GlobalVariable} from "../global";

@Injectable()
export class AppService {
    constructor (private http: Http) {}

    getTestData() {
        let url = GlobalVariable.BASE_API_URL + "/getTestData";
    }
}

