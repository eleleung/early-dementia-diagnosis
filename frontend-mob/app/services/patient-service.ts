/**
 * Created by EleanorLeung on 25/04/2017.
 */
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {SecurityService} from "./security.service";
import {GlobalVariable} from "../global";

@Injectable()
export class PatientService {

    constructor (private http: Http, private securityService: SecurityService) {

    }
}