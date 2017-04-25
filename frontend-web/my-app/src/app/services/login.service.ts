import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {GlobalVariable} from '../globals';
import {LoginModel, LoginResponse} from "../models/user";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class LoginService {

    constructor (private http: Http) {}

    login(model: LoginModel) {
        let tokenUrl = GlobalVariable.BASE_API_URL + 'users/authenticate/';
        let headers1 = new Headers({'Content-Type': 'application/json'});

        return this.http.post(tokenUrl, JSON.stringify(model), {headers: headers1}).map(res => res.json());
    }

    validate(token: string) {
        let userUrl = GlobalVariable.BASE_API_URL + 'users/validate/';
        let headers2 = new Headers({'Authorization': 'JWT ' + token});

        return this.http.get(userUrl, {headers: headers2}).map(res => res.json());
    }

    checkLogin() {
        // if (localStorage.getItem("user") != "" && localStorage.getItem("user") != null
        //     && localStorage.getItem("token") != "" && localStorage.getItem("token") != null) {
        //     return true;
        // } else {
        //     return false;
        // }
        return false;
    }

    logout() {
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
    }

    resetPassword(email: string) {
        // let tokenUrl = GlobalVariable.BASE_API_URL + '/user/resetPassword';
        // let headers1 = new Headers({'Content-Type': 'application/json'});
        //
        // return this.http.post(tokenUrl, email, {headers: headers1});
    }
}
