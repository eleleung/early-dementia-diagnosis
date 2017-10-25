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

        let components = [];
        let results = [];
        for (const section of test.sections) {
            let out = this.getComponent(section);
            components.push(out.component);
            results.push(out.result);
        }
        components.push(<SubmitTest getResults={this.getResults} test={test} filePath={filePath} back={this.back}/>);

        this.state = {
            step: 0,
            components: components,
            results: results
        }
    }

    getResults = () => {
        return this.state.results;
    }

    setFilename = (step, filename) => {
        const {results} = this.state;
        if (step >= results.length) {
            return;
        }
        results[step].filename = filename;
        this.setState({ results: results });
    }

    getFilename = (step) => {
        const {results} = this.state;
        if (step >= results.length) {
            return;
        }
        return results[step].filename;
    }

    getComponent = (section) => {
        const {test, filePath} = this.props;

        let component = null;        
        let result = null;
        const step = test.sections.indexOf(section);

        if (section.type == 'audio') {
            result = {
                filename: `${filePath}/test-id=${test._id}_section=${step}.aac`,
                originalname: `test-id=${test._id}_section=${step}.aac`,
                type: section.type
            }
            component = <RecordAudio key={step} result={result} section={section} step={step} next={this.next} back={this.back}/>;            
        }
        else if (section.type == 'image') {
            result = {
                filename: '', // This is set by the camera library - we cant control the name with the current library
                originalname: `test-id=${test._id}_section=${step}.aac`,
                type: section.type
            }
            component = <ImageCapture key={step} setFilename={this.setFilename} getFilename={this.getFilename} section={section} step={step} next={this.next} back={this.back}/>;
        }
        else if (section.type == 'question') {
            component = <AnswerQuestion key={step} testId={test._id} section={section} step={step} next={this.next} back={this.back} filePath={filePath}/>;
            result = {
                type: section.type
                // TODO: Answer Question Component
            }
        }

        return {component, result};
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