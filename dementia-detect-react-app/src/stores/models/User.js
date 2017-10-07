// @flow

import { observable } from 'mobx';
import { Patient } from './Patient.js';
import { persist } from 'mobx-persist';

class User {
    @persist @observable firstName: string;
    @persist @observable lastName: string;
    @persist @observable email: string;
    @observable password: string;
    @persist @observable patients: Patient[];
}

export default User;