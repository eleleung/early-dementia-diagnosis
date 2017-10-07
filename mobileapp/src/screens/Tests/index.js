import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import Constants  from '../../global/Constants';
import {style} from './style';

class Tests extends Component {

    render() {
        return (
            <View style={style.container}>
                <Text>
                    Tests Screen
                </Text>
            </View>
        )
    }
}

export default Tests;