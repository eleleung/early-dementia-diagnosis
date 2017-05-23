import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Patient} from "../models/patient";
import {GlobalVariable} from "../globals";
import {SecurityService} from "./security.service";
/**
 * Created by EleanorLeung on 23/05/2017.
 */

@Injectable()
export class PatientService {

    public patients: Array<Patient>;

    constructor(private http: Http, private securityService: SecurityService) {
        this.patients = [];
    }

    getPatientsServiceMethod() {
        let url = GlobalVariable.BASE_API_URL + "users/getPatients";
        let headers = this.securityService.loggedInHeader();

        return this.http.get(url, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                this.patients = data.carerPatients;
            });
    }

    getPatients() {
        let tokenUrl = GlobalVariable.BASE_API_URL + "users/getPatients";

        return this.http.get(tokenUrl, {headers: this.securityService.loggedInHeader()}).map(res => res.json());
    }
}
