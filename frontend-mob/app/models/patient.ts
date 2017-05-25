import {Carer} from "./carer";
import {Doctor} from "./doctor";

export class Patient {
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    carers: Carer[];
}