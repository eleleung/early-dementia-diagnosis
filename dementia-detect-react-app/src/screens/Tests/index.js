import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { List, ListItem } from 'react-native-elements';

import Constants  from '../../global/Constants';
import {style} from './style';

@inject('App', 'User') @observer
class Tests extends Component {

    constructor(props: Props) {
        super(props);

        this.state = {
            tests : [
                {
                    id: 1, 
                    name: 'Record Speech', 
                    icon: 'av-timer', 
                    sections: [
                        {
                            type: "audio",
                            instruction: "Read the text aloud.",
                            content: "A quick brown fox jumps over the lazy dog"
                        },
                        {
                            type: "audio",
                            instruction: "Have a 5 minute conversation.",
                            content: ""
                        }
                    ]
                },
                {
                    id: 2, 
                    name: 'Take Image', 
                    icon: 'flight-takeoff',
                    sections: [
                        {
                            type: "image",
                            instruction: "Read the text aloud.",
                            content: "A quick brown fox jumps over the lazy dog"
                        },
                        {
                            type: "image",
                            instruction: "Have a 5 minute conversation.",
                            content: ""
                        }
                    ]
                },
            ]
        }
    }

    navigateToTest = (test) => {
        const {navigator} = this.props;
        
        navigator.push({
            screen: Constants.Screens.TEST_SCREEN.screen,
            title: `Complete ${test.name}`,
            passProps: {test: test}
        });
    }

    render() {
        const {tests} = this.state;

        return (
            <View>
                <List containerStyle={{marginBottom: 20}}>
                {
                    tests.map((test, i) => (
                        <ListItem
                            key={test.id}
                            title={test.name}
                            leftIcon={{name: test.icon}}
                            onPress={() => this.navigateToTest(test)}
                        />
                    ))
                }
                </List>
            </View>
        )
    }
}

export default Tests;
