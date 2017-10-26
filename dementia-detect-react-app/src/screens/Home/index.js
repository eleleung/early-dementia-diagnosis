// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { List, ListItem, Icon } from 'react-native-elements';

import NavButtons from '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';

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
            <ScrollView style={style.container}>
                <Text>Your stats</Text>
                <List containerStyle={{ marginBottom: 20 }}>
                    <ListItem
                        title={'Completed Tests'}
                        leftIcon={{name: 'puzzle'}}
                        rightIcon={{name: 'a'}}
                        badge={{ value: 3, textStyle: { color: 'white' }, containerStyle: {  } }}

                    />
                </List>

                <Text>News</Text>

                <Text>Trials</Text>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,        
    },    
});    

export default Home;

