import {User} from './user';
import {Test} from './test';

/**
 * Created by nathanstanley on 25/4/17.
 */

export class Patient {
    _id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    carers: User[];
    tests: Test[];
}
