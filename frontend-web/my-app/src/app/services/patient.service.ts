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


    get patients(): Observable<Patient[]> {
        return this._patients.asObservable();
    }

    constructor(private http: Http, private securityService: SecurityService) {
        this.getPatients();
    }

    getPatients() {
        const url = GlobalVariable.BASE_API_URL + 'users/getPatients';
        const headers = this.securityService.loggedInHeader();

        this.http.get(url, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                this._patients.next(data.carerPatients);
            });
    }

    getPatientById(patientId: string) {
        const url = GlobalVariable.BASE_API_URL + 'patients/getPatientById';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({'_id' : patientId}), {headers: headers})
            .map(res => res.json());
    }

    getPatientTests(patientId: string) {
        const url = GlobalVariable.BASE_API_URL + 'tests/getPatientTests';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({'patientId' : patientId}), {headers: headers})
            .map(res => res.json());
    }

    getUserTests() {
        const url = GlobalVariable.BASE_API_URL + 'tests/getUserTests';
        const headers = this.securityService.loggedInHeader();

        return this.http.get(url, {headers: headers})
            .map(res => res.json());
    }

    savePatient(patient: Patient) {
        const url = GlobalVariable.BASE_API_URL + 'patients/update';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({'patient' : patient}), {headers: headers})
            .map(res => res.json());
    }

    addPatientTest(patientId: string, testId: string) {
        const url = GlobalVariable.BASE_API_URL + 'patients/add_patient_test';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({'patientId' : patientId, 'testId' : testId}), {headers: headers})
            .map(res => res.json());
    }

    getCompletedPatientTests(patientId: string) {
        const url = GlobalVariable.BASE_API_URL + 'patients/getCompletedPatientTests';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({'patientId': patientId}), {headers: headers})
            .map(res => res.json());
    }
}
