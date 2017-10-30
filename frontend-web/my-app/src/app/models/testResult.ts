import {User} from './user';
import {Patient} from './patient';
import {Test} from './test';

export class TestResult {
    name: string;
    test: Test;
    componentResults: any[];
    date: Date;
    creator: User;
    patient: Patient;
}

