// @flow

import { observable } from 'mobx';

class Patient {
    @observable firstName: string;
    @observable lastName: string;
}

export default Patient;