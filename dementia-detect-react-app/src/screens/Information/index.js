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

class Information extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <View style={style.container}>
                <Text>
                    Information Screen
                </Text>
            </View>
        )
    }
}

export default Information;