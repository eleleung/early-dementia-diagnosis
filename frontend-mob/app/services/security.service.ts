import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import applicationSettings = require("application-settings");

/**
 * Created by nathanstanley on 21/4/17.
 */
@Injectable()
export class SecurityService {

    constructor(private http: Http) {
    }

    loggedInHeader(): Headers {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", applicationSettings.getString("token"));
        return headers;
    }

    loggedOutHeader(): Headers {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    isToken(): boolean {
        let token = applicationSettings.getString("token");
        return token != null && token != '';
    }
}