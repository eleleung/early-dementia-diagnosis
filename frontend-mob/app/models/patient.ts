import {Carer} from "./carer";

export class Patient {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    carers: Carer[];
}