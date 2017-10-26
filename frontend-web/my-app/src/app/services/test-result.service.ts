import {Injectable} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';
import {SecurityService} from './security.service';
import {GlobalVariable} from '../globals';
import {LoginService} from './login.service';

@Injectable()
export class TestResultService {

    constructor(private http: Http, private securityService: SecurityService,
                private loginService: LoginService) {

    }

    loadAudio(patientId, filename: string) {
        const url = GlobalVariable.BASE_API_URL + 'test-results/audio';
        const headers = this.securityService.loggedInHeader();

        return this.http.post(url, {patientId: patientId, filename: filename}, {headers: headers, responseType: ResponseContentType.Blob});
    }
}
