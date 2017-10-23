import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Test} from "../models/test";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {SecurityService} from "./security.service";
import {GlobalVariable} from "../globals";
import {LoginService} from "./login.service";
/**
 * Created by EleanorLeung on 23/10/17.
 */
@Injectable()
export class TestService {
    public _tests: BehaviorSubject<Test[]> = new BehaviorSubject([]);

    get tests(): Observable<Test[]> {
        return this._tests.asObservable();
    }

    constructor(private http: Http, private securityService: SecurityService,
                private loginService: LoginService) {

    }

    saveTest(test, testName) {
        const url = GlobalVariable.BASE_API_URL + 'tests/saveTest';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, JSON.stringify({'components' : test, 'userId': this.loginService.user.id,
                                'testName': testName}), {headers: headers})
            .map(res => res.json());
    }
}
