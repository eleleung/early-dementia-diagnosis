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

        this.state = {
            step: 0,
            component: null
        }
    }

    next = () => {
        const {test} = this.props;        
        const {step} = this.state;

        this.setState({step: step + 1});
    }

    back = () => {
        const {step} = this.state;


        
        this.setState({step: step - 1});
    }

    render() {
        const {test} = this.props;
        const {step} = this.state;

        let component = null;        

        if (step < test.sections.length)
        {
            const section = test.sections[step];
            if (section.type == 'audio') {
                component = <RecordAudio section={section}/>;
            }
            else if (section.type == 'image') {
                component = <ImageCapture section={section}/>;
            }
            else if (section.type == 'question') {
                component = <AnswerQuestion section={section}/>;
            }
        }
        else {
            component = <SubmitTest test={test}/>;
        }

        return (
            <View style={{flex:1}}>
                {component}
                <View style={styles.container}>
                    <Button 
                        style={styles.button}
                        raised
                        title='Back' 
                        icon={{name: 'chevron-left'}}
                        onPress={() => this.back()}
                    />
                    <Button 
                        style={styles.button}
                        raised
                        title='Next' 
                        iconRight={{name: 'chevron-right'}}
                        onPress={() => this.next()}
                    />
                </View>
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
        width: '50%',
    }
});

export default Test;