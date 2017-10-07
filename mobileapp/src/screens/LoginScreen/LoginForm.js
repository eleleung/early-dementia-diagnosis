import {observable, computed} from 'mobx';
import validate from 'mobx-form-validate';

export default class LoginForm {
    @observable
    @validate(/^.+$/, 'Please enter a password')
    password = '';
}