import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {GlobalVariable} from '../globals';
import {LoginModel, User} from '../models/user';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {SecurityService} from './security.service';
import {Doctor} from '../models/doctor';

@Injectable()
export class LoginService {

    user: User;
    doctor: Doctor;

    constructor (private http: Http, private router: Router, private securityService: SecurityService) {
        if (this.user == null || (localStorage.getItem('token') != null && localStorage.getItem('token') != '')) {
            this.validate().subscribe(
                data => {
                    this.user = data.user;
                    if (data.doctor) {
                        this.doctor = data.doctor;
                    }
                },
                error => {
                    console.log(error);
                }
            );
        }
    }

    getUser() {
        this.validate().subscribe(
            data => {
                this.user = data.user;
            },
            error => {
                console.log(error);
            }
        );
    }

    login(model: LoginModel) {
        const tokenUrl = GlobalVariable.BASE_API_URL + 'users/authenticate/';
        const headers1 = new Headers({'Content-Type': 'application/json'});

        return this.http.post(tokenUrl, JSON.stringify(model), {headers: headers1}).map(res => res.json());
    }

    validate() {
        const userUrl = GlobalVariable.BASE_API_URL + 'users/validate/';
        return this.http.get(userUrl, {headers: this.securityService.loggedInHeader()}).map(res => res.json());
    }

    checkLogin() {
        return (this.user && localStorage.getItem('token') != '' && localStorage.getItem('token') != null);
    }

    logout() {
        localStorage.setItem('token', '');
        this.user = null;
        this.router.navigate(['/login']);
    }

    // TODO: Implement reset password
    resetPassword(email: string) {
        // let tokenUrl = GlobalVariable.BASE_API_URL + '/user/resetPassword';
        // let headers1 = new Headers({'Content-Type': 'application/json'});
        //
        // return this.http.post(tokenUrl, email, {headers: headers1});
    }
}
