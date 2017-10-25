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
            // tests: [
            //     {
            //         _id: '59edb2c723256124f41617ed', 
            //         name: 'Record Speech', 
            //         icon: 'av-timer', 
            //         sections: [
            //             {
            //                 type: "audio",
            //                 instruction: "Press record and read the text aloud",
            //                 content: "A quick brown fox jumps over the laz y dog, then runs around in the park before chasing its tail for 20 minutes."
            //             },
            //             {
            //                 type: "audio",
            //                 instruction: "Have a 5 minute conversation.",
            //                 content: "Aim to ask a similar question at least twice in the five minutes."
            //             }
            //         ]
            //     },
            //     {
            //         _id: 2, 
            //         name: 'Take Image', 
            //         icon: 'flight-takeoff',
            //         sections: [
            //             {
            //                 type: "image",
            //                 instruction: "Take A Photo",
            //                 content: "Draw an image of an analogue clock and take a photo of it. "
            //             },
            //             {
            //                 type: "image",
            //                 instruction: "Take A Photo",
            //                 content: "Take a photo of the patient."
            //             }
            //         ]
            //     },
            // ]
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
        const { User } = this.props;
        

        return (
            <View>
                <List containerStyle={{marginBottom: 20}}>
                {
                    User.selectedPatientTests.map((test, i) => (
                        <ListItem
                            key={test._id}
                            title={test.name}
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
