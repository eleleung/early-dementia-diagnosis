import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Button } from 'react-native-elements'

import Constants  from '../../../global/Constants';
import {style} from './style';
import RecordAudio from './RecordAudio'
import ImageCapture from './ImageCapture'
import AnswerQuestion from './AnswerQuestion'
import SubmitTest from './SubmitTest'

class Test extends Component {

    constructor (props: Props) {
        super(props);

        let {test, filePath} = this.props;

        let components = []        
        for (const section of test.sections) {
            components.push(this.getComponent(section));
        }
        components.push(<SubmitTest test={test} filePath={filePath}/>);

        this.state = {
            step: 0,
            components: components
        }
    }

    getComponent = (section) => {
        const {test, filePath} = this.props;
        let component = null;        
        const step = test.sections.indexOf(section);

        if (section.type == 'audio') {
            component = <RecordAudio key={section.id} testId={test.id} section={section} step={step} next={this.next} back={this.back} filePath={filePath}/>;
        }
        else if (section.type == 'image') {
            component = <ImageCapture key={section.id} testId={test.id} section={section} step={step} next={this.next} back={this.back} filePath={filePath}/>;
        }
        else if (section.type == 'question') {
            component = <AnswerQuestion key={section.id} testId={test.id} section={section} step={step} next={this.next} back={this.back} filePath={filePath}/>;
        }

        return component;
    }

    sendTest = () => {
        const {step, components} = this.state;
        //TODO: submit new test
    }

    next = () => {
        const {step, components} = this.state;
        this.setState({step: Math.min(step + 1, components.length - 1)});
    }

    back = () => {
        const {step} = this.state;
        this.setState({step: Math.max(step - 1, 0)});
    }

    render() {
        const {step, components} = this.state;
                
        return (
            <View style={{flex:1, flexDirection:'column'}}>
                {components[step]} 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        
    }
});

export default Test;