// @flow

import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    TextInput
} from 'react-native';
import {inject, observer} from 'mobx-react/native';

import Constants  from '../../global/Constants';
import * as api from '../../api';
import {style} from './style';

@inject('App', 'User') @observer
class Settings extends Component {
    constructor(props) {
        super(props);
    };

    logout = () => {
        const {User} = this.props;

        User.logout();
        Constants.Global.startSingleScreenApp();
    };

    addPatient = () => {
        const {navigator} = this.props;

        navigator.push({
            screen: Constants.Screens.ADD_PATIENT_SCREEN.screen,
            title: ''
        });
    };

    changeSelectedPatient = () => {
        console.log('changing selected patient');
    };

    render() {
        const {User} = this.props;

        return (
            <View style={style.container}>
                <Text style={style.settings_heading}>Current Account</Text>
                {
                    User.current && User.current.firstName 
                    ?
                    <Text style={style.labels}>{User.current.firstName}</Text>
                    :
                    null
                }
                <Text 
                    style={style.labels}
                    onPress={ () => this.addPatient()}>
                    Add Patient    
                </Text>
                <Text
                    style={style.labels}
                    onPress={ () => this.changeSelectedPatient()}>
                    Change Patient Account
                </Text>                
                <Button
                    title={`Log Out`}
                    onPress={ () => this.logout() }
                />
            </View>
        )
    }
}

export default Settings;