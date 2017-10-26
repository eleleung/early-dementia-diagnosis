// @flow

import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    Modal
} from 'react-native';
import {inject, observer} from 'mobx-react/native';
import {Button, Icon, List, ListItem, FormLabel, FormInput} from 'react-native-elements';

import Constants  from '../../global/Constants';
import * as api from '../../api';
import {style} from './style';

const niceGreen = "#2ECC40";

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
            <List containerStyle={{
                        marginBottom: 20,
                    }}>
                    {
                        User.patients.length > 0 && 
                        User.selectedPatient
                        ?
                            <ListItem
                                title={`Current Patient: ${User.selectedPatient.firstName} ${User.selectedPatient.lastName}`}
                                fontFamily='Helvetica Neue'
                                hideChevron={true}
                            />
                        :
                        null
                    }
                    <ListItem 
                        onPress={ () => this.addPatient() }
                        leftIcon={{name: 'add'}}
                        title={'Add Patient'}
                    />
                    <ListItem
                        onPress={ () => this.changeSelectedPatient() }
                        leftIcon={{name: 'people'}}
                        title={'Change Patient Account'}
                    />
                    <ListItem
                        onPress={ () => this.showModal() }
                        leftIcon={{name: 'person-add'}}
                        title={'Assign a Doctor'}
                    />
            </List> 
            
            <List>
                <ListItem
                    title={'My Details'}
                    leftIcon={{name: 'edit'}}
                    />
            </List> 

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}>

                <View style={{
                    flex: 1                            
                }}>
                    <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <FormLabel>Enter in the doctor's reference code below</FormLabel>
                        <FormInput
                        style={style.text_input}
                        autoCapitalize={'none'}
                        onChangeText={ (referenceCode) => this.setState({ referenceCode }) }
                        value={ referenceCode }
                        placeholder={`Reference Code`}/>
                    </View>

                    <Button
                        title={`Submit`}
                        backgroundColor={niceGreen}
                        onPress={ () => this.submit() }
                    />
                    <Button
                        style={{
                            marginTop: 15,
                            marginBottom: 40
                        }}
                        title={`Cancel`}
                        onPress={ () => this.setState({modalVisible: !modalVisible}) }
                    />
                </View>

            </Modal>
            <Button
                backgroundColor='red'
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