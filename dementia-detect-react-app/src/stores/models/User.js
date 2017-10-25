// @flow

import { observable } from 'mobx';
import { Patient } from './Patient.js';
import { persist } from 'mobx-persist';

class User {
    @persist @observable _id: string;
    @persist @observable firstName: string;
    @persist @observable lastName: string;
    @persist @observable email: string;
    @observable password: string;
}

export default User;