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
import {Patient} from "../models/patient";

@Injectable()
export class CarerService {

    patients: Array<Patient>;
    selectedPatient: Patient;

    constructor (private http: Http, private securityService: SecurityService) {
        this.patients = [];
    }

    getProfile() {
        let url = GlobalVariable.BASE_API_URL + "/users/profile/";
        let headers = this.securityService.loggedInHeader();
        return this.http.get(url, {headers: headers}).map(res => res.json());
    }

    getCarersPatients() {
        let url = GlobalVariable.BASE_API_URL + "/users/getPatients";
        let headers = this.securityService.loggedInHeader();

        return this.http.get(url, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                this.patients = data.carerPatients;

                // select default patient at random, could allow user to pick default later
                if (this.selectedPatient == null && this.patients.length > 0) {
                    this.selectedPatient = this.patients[0];
                }
        });
    }
}