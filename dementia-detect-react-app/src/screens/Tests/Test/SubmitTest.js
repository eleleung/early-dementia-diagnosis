import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView, 
    Image
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Button, Icon, Card } from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';

import SoundPlayer from './SoundPlayer';
import Constants  from '../../../global/Constants';
import {style} from './style';

@inject('App', 'User') @observer
class SubmitTest extends Component {
    constructor(props: Props) {
        super(props);
        const {getResults} = this.props;

        const results = getResults();
        this.state = {
            results: results
        }
        console.log(results);
    }
    
    getCardInfo = (section, index) => {
        const {filePath, test} = this.props;
        const {results} = this.state;

        const result = results[index];
        
        if (section.type == 'audio') {
            return <SoundPlayer audioPath={result.filename}/>;
        }
        else if (section.type == 'image') {
            return <Image source={{uri: result.filename}}
                        resizeMode="contain" 
                        style={{ width: null, height:400 }}/>
        }
    }

    submitTest = () => {
        const { User, filePath, test } = this.props;
        const { results } = this.state;

        let params = [];

        const jsonData = {
            patientId: User.selectedPatient._id,
            testId: test._id,
            test: test,
            results: results,
        }
        params.push({
            name : 'json',
            data: JSON.stringify(jsonData)
        });

        for (const result of results) {
            const step = results.indexOf(result);
            const fileURI = result.filename;

            if (result.filename) {
                const fileType = test.sections[step].type == 'audio' ? 'aac' : 'png';
                const param = {
                    name : 'file',
                    filename : `test-id=${test._id}_section=${step}.${fileType}`,
                    data: RNFetchBlob.wrap(fileURI)
                }
                params.push(param);
            }
        }

        RNFetchBlob.fetch(
            'POST', 
            'http://localhost:3000/tests/submit_test', 
            {
                Authorization : User.token,
                'Content-Type' : 'multipart/form-data'
            }, 
            params
        )
        .then((res) => {
            console.log(res.text())
        })
        .catch((err) => {
            // error handling .. 
        })
    }

    render () {
        const {test, back} = this.props;

        return (
            <View style={styles.container}>
                <View style={{flex:8}}>
                    <ScrollView style={styles.container}>
                        {
                            test.sections.map((section, i) => (
                                <Card 
                                    key={i} 
                                    title={`Step ${i + 1}: ${section.instruction}`}>
                                    <View>
                                        {this.getCardInfo(section, i)}
                                    </View>
                                </Card>
                            ))
                        }
                    </ScrollView>
                </View>
                <View style={styles.controls}>
                    <View style={{flex:1}}>
                        <Icon iconStyle={styles.iconBtn}
                            size={30}
                            name='chevron-left'
                            onPress={back}/>
                    </View>
                    <View style={{flex:4, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                        <View style={{flex:1, justifyContent:'space-around'}}>
                            <Button title={'Submit'} 
                                iconRight={{name:'send'}} 
                                buttonStyle={styles.submitButton}
                                onPress={this.submitTest}/>
                        </View>
                    </View>
                    <View style={{flex:1}}>
                    </View>
                </View>
            </View>
        )
    }
}

export default SubmitTest;

const niceGreen = "#2ECC40";

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    controls: {
        flex:1, 
        flexDirection:'row', 
        backgroundColor:'#f2f2f2'
    },
    button: {
        height:'100%',
        width:'100%',
        margin:0
    },
    iconBtn: {
        height:'100%',
        paddingTop:'27%',
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: niceGreen
    },
});