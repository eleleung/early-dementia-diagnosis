import {User} from "./user";
/**
 * Created by nathanstanley on 25/4/17.
 */
export class Patient {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    carers: User[];
}
