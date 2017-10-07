// @flow

import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    TouchableOpacity
} from 'react-native';
import {inject, observer} from 'mobx-react/native';
import {SegmentedControls} from 'react-native-radio-buttons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import format from 'date-fns/format';

import Constants  from '../../global/Constants';
import Models from '../../stores/models';
import {style} from './style';

@inject('App', 'User') @observer
class AddPatient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            dateOfBirth: null,
            gender: '',
            isDatePickerVisible: false,
            selectedSegment: ''
        }
    };

    setSelectedOption = (selected) => {
        this.setState({
            gender: selected == "Female" ? "F" : "M",
            selectedSegment: selected
        });
    };

    handleDatePicked = (date) => {
        this.setState({dateOfBirth: date});
        this.hideDatePicker();
    };

    showDatePicker = () => {
        this.setState({isDatePickerVisible: true});
    };

    hideDatePicker = () => {
        this.setState({isDatePickerVisible: false});
    };

    registerPatient = async () => {
        const {
            firstName,
            lastName,
            dateOfBirth,
            gender
        } = this.state;

        const { User, navigator } = this.props;

        if (firstName && lastName && dateOfBirth && gender) {
            let patient = new Models.Patient();
            patient.firstName = firstName;
            patient.lastName = lastName;
            patient.dateOfBirth = format(dateOfBirth, "YYYY-MM-DD");
            patient.gender = gender;
            
            const result = await User.registerPatient(patient);
            result == true ? navigator.pop() : alert("Error with adding patient");
        } else {
            console.log("make sure all fields have been filled");
        }
    };

    updateFirstName = firstName => this.setState({firstName});
    updateLastName = lastName => this.setState({lastName});

    render() {
        const {
            firstName, 
            lastName, 
            dateOfBirth, 
            gender,
            isDatePickerVisible,
            selectedSegment
        } = this.state;

        const options = [
            'Female',
            'Male'
        ];

        return (
            <View style={style.container}>
                <Text style={style.formTitle}>New Patient Form</Text>
                <TextInput 
                    style={style.textField}
                    placeholder={'First Name'}
                    value={firstName}
                    onChangeText={this.updateFirstName} 
                />
                <TextInput 
                    style={style.textField}
                    placeholder={'Last Name'}
                    value={lastName}
                    onChangeText={this.updateLastName} 
                />
                <SegmentedControls 
                    options={options}
                    containerStyle={{
                        marginTop: 10, 
                        marginRight: 40, 
                        marginLeft: 40
                    }}
                    onSelection={this.setSelectedOption}
                    selectedOption={selectedSegment}
                />
                <TouchableOpacity onPress={this.showDatePicker}>
                    <View pointerEvents='none'>
                        <TextInput 
                            style={style.textField}
                            placeholderTextColor={dateOfBirth != null ? '#000000' : '#CCCCCC'}
                            placeholder={dateOfBirth != null ? format(dateOfBirth, 'DD MMM YYYY') : 'Date of Birth'}
                            editable={false}
                        />
                    </View>
                </TouchableOpacity>
                <DateTimePicker 
                    onConfirm={this.handleDatePicked}
                    isVisible={isDatePickerVisible}
                    onCancel={this.hideDatePicker}
                />
                <Button
                title={`Submit`}
                onPress={ () => this.registerPatient() }/>
            </View>
        )
    }
}

export default AddPatient;