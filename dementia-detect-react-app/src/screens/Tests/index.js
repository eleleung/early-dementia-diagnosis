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
import { AudioUtils } from 'react-native-audio';

import { inject, observer } from 'mobx-react/native';
import { List, ListItem } from 'react-native-elements';

import Constants  from '../../global/Constants';
import {style} from './style';

@inject('App', 'User') @observer
class Tests extends Component {

    constructor(props: Props) {
        super(props);
        const filePath = AudioUtils.DocumentDirectoryPath;

        this.state = {
            filePath: filePath,
            tests: [
                {
                    id: 1, 
                    name: 'Record Speech', 
                    icon: 'av-timer', 
                    sections: [
                        {
                            id: 1,
                            type: "audio",
                            instruction: "Press record and read the text aloud",
                            content: "A quick brown fox jumps over the laz y dog, then runs around in the park before chasing its tail for 20 minutes."
                        },
                        {
                            id: 2,
                            type: "audio",
                            instruction: "Have a 5 minute conversation.",
                            content: "Aim to ask a similar question at least twice in the five minutes."
                        }
                    ]
                },
                {
                    id: 2, 
                    name: 'Take Image', 
                    icon: 'flight-takeoff',
                    sections: [
                        {
                            id: 3,
                            type: "image",
                            instruction: "Read the text aloud.",
                            content: "A quick brown fox jumps over the lazy dog"
                        },
                        {
                            id:4,
                            type: "image",
                            instruction: "Have a 5 minute conversation.",
                            content: "Aim to ask a similar question at least twice in the five minutes."
                        }
                    ]
                },
            ]
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
