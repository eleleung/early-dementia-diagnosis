import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {GlobalVariable} from '../globals';
import {LoginModel, User} from "../models/user";
import {Router} from "@angular/router";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class LoginService {

    user: User;

    constructor (private http: Http, private router: Router) {}

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
        return (this.user && localStorage.getItem("token") != "" && localStorage.getItem("token") != null);
    }

    logout() {
        localStorage.setItem("token", "");
        this.user = null;
        this.router.navigate(['/login']);
    }

    resetPassword(email: string) {
        // let tokenUrl = GlobalVariable.BASE_API_URL + '/user/resetPassword';
        // let headers1 = new Headers({'Content-Type': 'application/json'});
        //
        // return this.http.post(tokenUrl, email, {headers: headers1});
    }
}
