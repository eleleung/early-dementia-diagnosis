// @flow

import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    TextInput
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { style } from './style';

@inject('App', 'User') @observer
class RegisterScreen extends Component {

    state: State;

    constructor(props: Props) {
        super(props);
    
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password2: '',
        };
    }

    register = async () => {
        const { User } = this.props;
        const { firstName, lastName, email, password, password2 } = this.state;

        const result = await User.register(firstName, lastName, email, password, password2);
        if (result) {
            const {navigator} = this.props;
            
            navigator.pop();
        }
        else {
            alert('An error occurred during registration. Please check and try again');
            console.log('Invalid login credentials');
        }
    };

    render() {
        const { firstName, lastName, email, password, password2 } = this.state;

        return ( 
            <View style={style.container}>
                <Text style={style.formTitle}>Sign up</Text>
                <TextInput 
                    style={style.textField}
                    placeholder={'First Name'}
                    onChangeText={(firstName) => this.setState({firstName})} />
                <TextInput 
                    style={style.textField}
                    placeholder={'Last Name'}
                    onChangeText={(lastName) => this.setState({lastName})} />
                <TextInput 
                    style={style.textField}
                    autoCapitalize={'none'}
                    keyboardType={'email-address'}
                    placeholder={'Email'}
                    onChangeText={(email) => this.setState({email})} />
                <TextInput 
                    style={style.textField}
                    autoCapitalize={'none'}
                    placeholder={'Password'}
                    onChangeText={(password) => this.setState({password})} 
                    secureTextEntry={true} />
                <TextInput 
                    style={style.textField}
                    autoCapitalize={'none'}
                    placeholder={'Confirm Password'}
                    onChangeText={(password2) => this.setState({password2})} 
                    secureTextEntry={true} />
                <Button
                    title={`Create Account`}
                    onPress={ () => this.register() } />
            </View>
        )
    }
}

export default RegisterScreen;