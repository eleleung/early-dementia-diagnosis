import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { AudioUtils } from 'react-native-audio';

import { inject, observer } from 'mobx-react/native';
import { List, ListItem, Icon } from 'react-native-elements';

import Constants  from '../../global/Constants';
import {style} from './style';

@inject('App', 'User') @observer
class Tests extends Component {

    constructor(props: Props) {
        super(props);
        const filePath = AudioUtils.DocumentDirectoryPath;


        this.state = {
            filePath: filePath,
            refreshing: false,
        }
    }

    navigateToTest = (test) => {
        const {navigator} = this.props;
        const {filePath} = this.state;
        
        navigator.push({
            screen: Constants.Screens.TEST_SCREEN.screen,
            title: `Complete ${test.name}`,
            passProps: {test: test, filePath: filePath}
        });
    }

    onRefresh = async () => {
        const {User} = this.props;
        
        this.setState({ refreshing: true });
        await User.inflatePatientTests();
        this.setState({ refreshing: false });
    };

    render() {
        const {tests, refreshing} = this.state;
        const { User } = this.props;

        return (
            <ScrollView 
                style={style.container}
                refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={this.onRefresh}
                />
                }>
                <View style={style.container}>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <View style={{
                            marginTop: 15,
                            marginLeft: 20
                        }}>
                            <Icon 
                                name='lightbulb-o'
                                type='font-awesome'
                            />
                        </View>
                        <Text style={style.heading}>Complete the tests assigned to {User.selectedPatient.firstName}</Text>
                    </View>
                    <List containerStyle={{
                        marginBottom: 20,
                    }}>
                    {
                        User.selectedPatientTests.map((test, i) => (
                            <ListItem
                                key={test._id}
                                title={test.name}
                                onPress={() => this.navigateToTest(test)}
                                fontFamily='Helvetica Neue'
                            />
                        ))
                    }
                    </List>
                </View>
            </ScrollView>
        )
    }
}

export default Tests;