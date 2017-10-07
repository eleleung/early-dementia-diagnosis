// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons from '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';

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
        if (result) {
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

        <View style={styles.form}>

          <TextInput
            style={ styles.text_input }
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            onChangeText={ (email) => this.setState({ email }) }
            value={ this.state.email }
            placeholder={`email`}
          />

          <TextInput
            style={ styles.text_input }
            onChangeText={ (password) => this.setState({ password }) }
            value={ this.state.password }
            placeholder={`password`}
            secureTextEntry={true}
          />

          <Button
            title={`Log in`}
            onPress={ () => this.login(email, password) }
          />
          <Button
            title={`Create Account`}
            onPress={ () => this.register() }
          />

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.Colors.backgroundColor,
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_input: {
    width: 250,
    height: 40,
    padding: 10,
    margin: 5,

    borderWidth: 0.5,
    borderColor: Constants.Colors.blackColor,
    borderRadius: 20,
  }
})

export default LoginScreen;
