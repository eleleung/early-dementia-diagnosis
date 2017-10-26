// @flow

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Modal
} from 'react-native';
import {inject, observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';

import Constants  from '../../global/Constants';
import * as api from '../../api';
import {style} from './style';

@inject('App', 'User') @observer
class Settings extends Component {
    constructor(props) {
        super(props);
    };

    state = {
        modalVisible: false,
        referenceCode: '',
    };

    addPatient = () => {
        const {navigator} = this.props;

        navigator.push({
            screen: Constants.Screens.ADD_PATIENT_SCREEN.screen,
            title: ''
        });
    };

    changeSelectedPatient = () => {
        const {navigator} = this.props;
        
        navigator.push({
            screen: Constants.Screens.PATIENT_LIST_SCREEN.screen,
            title: ''
        });
    };

    showModal = () => {
        const {modalVisible} = this.state;

        this.setState({modalVisible: true});
    };

    hideModal = () => {
        const {modalVisible} = this.state;

        this.setState({modalVisible: false});
    };

    updateReferenceCode = e => {this.setState({referenceCode: e.target.value})};
 
    submit = async() => {
        const {User} = this.props;
        const {referenceCode, modalVisible, successfulLink} = this.state;
        

        const result = await User.assignDoctor(User.selectedPatient._id, referenceCode);
        if (result) {
            this.hideModal();
        }
        else {
            alert('Error: please check the reference code');
        }
    };

    logout = () => {
        const {User} = this.props;

        User.logout();
        Constants.Global.startSingleScreenApp();
    };

    render() {
        const {User} = this.props;
        const {modalVisible, referenceCode} = this.state;

        return (
            <View style={style.container}>
                <Text style={style.settings_heading}>Patient Account</Text>
                {
                    User.selectedPatient
                    ?
                    <Text style={style.labels}>{`${User.selectedPatient.firstName} ${User.selectedPatient.lastName}`}</Text>
                    :
                    null
                }
                <Text 
                    style={style.labels}
                    onPress={ () => this.addPatient() }>
                    Add Patient    
                </Text>
                <Text
                    style={style.labels}
                    onPress={ () => this.changeSelectedPatient() }>
                    Change Patient Account
                </Text>
                <Text
                    style={style.labels}
                    onPress={ () => this.showModal() }>
                    Assign a Doctor
                </Text>  
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}>
                    <View style={style.container}>
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{marginBottom: 15}}>Enter in the doctor's reference code below</Text>
                            <TextInput 
                                placeholder={'Reference Code'}
                                style={style.text_input}
                                value={referenceCode}
                                autoCapitalize={'none'}
                                onChangeText={ (referenceCode) => this.setState({ referenceCode }) }
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 20}}>
                            <Button
                                title={`Cancel`}
                                onPress={ () => this.setState({modalVisible: !modalVisible}) }
                            />
                            <Button
                                title={`Submit`}
                                onPress={ () => this.submit() }
                            />
                        </View>
                    </View>
                </Modal>
                <Button
                    style={{
                        marginTop: 30,
                    }}
                    title={`Log Out`}
                    onPress={ () => this.logout() }
                />
            </View>
        )
    }
}

export default Settings;