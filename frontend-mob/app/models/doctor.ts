/**
 * Created by EleanorLeung on 10/05/2017.
 */
import {Patient} from "./patient";

export class Doctor {
    email: string;
    password: string;
    confirm_password: string;
    firstName: string;
    lastName: string;
    patients: Patient[]
}