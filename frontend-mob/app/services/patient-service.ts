/**
 * Created by EleanorLeung on 25/04/2017.
 */
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {SecurityService} from "./security.service";
import {GlobalVariable} from "../global";
import {Test} from "../models/test";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PatientService {

    public _patientTests: BehaviorSubject<Test[]> = new BehaviorSubject([]);
    patientTest: Array<Test> = [];

    get patientTests(): Observable<Test[]> {
        return this._patientTests.asObservable();
    }

    constructor (private http: Http, private securityService: SecurityService) {
    }

    getPatientTestsBad(patientId: string) {
        let url = GlobalVariable.BASE_API_URL + "/tests/getPatientTests";
        let headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({"_id" : patientId}), {headers: headers})
            .map(res => res.json());
    }

    getPatientTests(patientId: string) {
        let url = GlobalVariable.BASE_API_URL + "/tests/getPatientTests";
        let headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({"_id" : patientId}), {headers: headers})
            .map(res => res.json())
            .subscribe(
                data => {
                    this.patientTest = data.tests;
                },
                err => {
                    console.log(err);
                }
        )
    }
}