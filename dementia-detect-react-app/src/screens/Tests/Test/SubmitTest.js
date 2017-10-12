import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Button, Icon, Card } from 'react-native-elements'

import SoundPlayer from './SoundPlayer';
import Constants  from '../../../global/Constants';
import {style} from './style';


class SubmitTest extends Component {
    constructor(props: Props) {
        super(props);
    }
    
    getCardInfo = (section) => {
        const {filePath, test} = this.props;
        
        if (section.type == 'audio') {
            return <SoundPlayer audioPath={filePath + `/id=${test.id}-section=${section.id}.aac`}/>;
        }
    }

    render () {
        const {test} = this.props;

        return (
            <ScrollView style={styles.container}>
                {
                    test.sections.map((section, i) => (
                        <Card 
                            key={section.id} 
                            title={`Step ${i + 1}: ${section.instruction}`}>
                            <View>
                                {this.getCardInfo(section)}
                            </View>
                        </Card>
                    ))
                }
                <Button title={'Submit'} iconRight={{name:'send'}} buttonStyle={styles.submitButton}/>
            </ScrollView>
        )
    }
}

export default SubmitTest;

const niceGreen = "#2ECC40";

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: niceGreen
    },
});