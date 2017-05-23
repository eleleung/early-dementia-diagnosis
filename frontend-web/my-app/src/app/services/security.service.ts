/**
 * Created by EleanorLeung on 23/05/2017.
 */
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class SecurityService {

    constructor (private http:Http) {}

    loggedInHeader():Headers {
        return new Headers({'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")});
    }

    loggedOutHeader():Headers {
        return new Headers({'Content-Type': 'application/json'});
    }

    getLoggedInUser() {
        let user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            return user;
        }
        return null;
    }

}
