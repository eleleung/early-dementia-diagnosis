import {Carer} from "./carer";
import {Doctor} from "./doctor";

export class Patient {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    carers: Carer[];
    doctors: Doctor[];
}