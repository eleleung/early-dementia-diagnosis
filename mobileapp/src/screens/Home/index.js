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
import {style}    from './style';

@inject('App', 'User') @observer
class Home extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {

    }
    
    render() {
        const { User } = this.props;

        return (
            <View style={style.container}> 
                {
                    User.current && User.current.firstName 
                    ?
                    <Text>Hi {User.current.firstName}</Text>
                    :
                    null
                }
            </View>
        )
    }
}

export default Home;