import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Patient} from "../models/patient";
import {GlobalVariable} from "../globals";
import {SecurityService} from "./security.service";
import {BehaviorSubject, Observable} from "rxjs";
/**
 * Created by EleanorLeung on 23/05/2017.
 */

@Injectable()
export class PatientService {

    public _patients: BehaviorSubject<Patient[]> = new BehaviorSubject([]);

    constructor(private http: Http, private securityService: SecurityService) {
        this.getPatients();
    }

    getPatients() {
        let url = GlobalVariable.BASE_API_URL + "users/getPatients";
        let headers = this.securityService.loggedInHeader();

        this.http.get(url, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                this._patients.next(data.carerPatients);
                console.log(data)
            });
    }

    get patients(): Observable<Patient[]> {
        return this._patients.asObservable();
    }
}
