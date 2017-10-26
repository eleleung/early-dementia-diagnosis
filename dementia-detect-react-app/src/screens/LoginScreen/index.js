// @flow

import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons from  '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';
import { Button, FormLabel, FormInput } from 'react-native-elements'

type Props = {
    withCancelButton : boolean,
}

type State = {
    email: string,
    password: string,
}

@inject('App', 'User') @observer
class LoginScreen extends Component {
    static navigatorButtons = NavButtons.Login;
    static navigatorStyle   = NavBar.Default;

    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    componentDidMount() {
        this.handleVisibilityOfNavButtons();
        this.login('ele@gmail.com', 'admin');
    }

    onNavigatorEvent = (event: { id: string }) => {
        const { withCancelButton } = this.props;

        switch (event.id) {
        case 'cancel':
            this.dismiss();
            break;
        case 'backPress':
            if (withCancelButton) this.dismiss();
            break;
        default:
        }
    }

    handleVisibilityOfNavButtons = () => {
        const { navigator, withCancelButton } = this.props;

        if (!withCancelButton) {
            navigator.setButtons({ leftButtons: [] })
        }
    }

    dismiss = () => {
        const { navigator } = this.props;

        navigator.dismissModal();
    }

    login = async (email: string, password: string) => {
        const { User } = this.props;

        const result = await User.login(email, password);
        console.log(result);
        if (result) {
            await User.getPatients();

            Constants.Global.startTabBasedApp();
        }
        else {
            console.log('Invalid login credentials');
        }
    }

    register = async () => {
        const {navigator} = this.props;
      
        navigator.push({
            screen: Constants.Screens.REGISTER_SCREEN.screen,
            title: 'Create Account'
        });
    }

  render() {
    const { navigator, User } = this.props;
    const { email, password } = this.state;

    return (
        <View style={styles .container}>
            <Image style={{height:150, marginBottom: 40}} source={require('../../../img/logo.psd')}/>
            <FormLabel>Email</FormLabel>
            <FormInput
                style={styles.text_input}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={ (email) => this.setState({ email }) }
                value={ this.state.email }
                placeholder={`email`}/>
            
            <FormLabel>Password</FormLabel>
            <FormInput
                style={ styles.text_input }
                onChangeText={ (password) => this.setState({ password }) }
                value={ this.state.password }
                placeholder={`password`}
                secureTextEntry={true}/>
        
            <Button
                style={ styles.login }
                backgroundColor={niceGreen}
                title={`Log In`}
                onPress={ () => this.login(email, password) }
            />
            <Button
                style={ styles.create_account }
                title={`Create Account`}
                onPress={ () => this.register() }
            />
        </View>
    );
  }
}

const niceGreen = "#2ECC40";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Constants.Colors.backgroundColor,
    },
    form: {
        justifyContent: 'center',
    },
    login: {
        marginTop:30,
    },
    create_account: {
        marginTop:15
    },
    text_input: {
        width: 330,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        margin: 0,
    }
});

export default LoginScreen;
