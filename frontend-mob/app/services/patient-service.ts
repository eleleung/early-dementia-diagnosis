/**
 * Created by EleanorLeung on 25/04/2017.
 */
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {SecurityService} from "./security.service";
import {GlobalVariable} from "../global";
import {Test} from "../models/test";

@Injectable()
export class PatientService {

    patientTests: Array<Test>;

    constructor (private http: Http, private securityService: SecurityService) {
        this.patientTests = [];
    }

    getPatientTests(patientId: string) {
        let url = GlobalVariable.BASE_API_URL + "/tests/getPatientTests";
        let headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({"_id" : patientId}), {headers: headers})
            .map(res => res.json())
            .subscribe(
                data => {
                    this.patientTests = data.tests;
                },
                err => {
                    console.log(err);
                }
        )
    }
}