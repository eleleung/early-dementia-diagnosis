import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated
} from 'react-native';
import { Button, Icon, Card, Slider } from 'react-native-elements'

import { inject, observer } from 'mobx-react/native';
import Sound from 'react-native-sound';
import Constants  from '../../../global/Constants';
import {style} from './style';

const niceGreen = "#2ECC40"

const PLAYING = 'playing';
const STOPPED = 'stopped';
const NONE = 'none';


class SoundPlayer extends Component {

    constructor(props: Props) {   
        super(props);

        this.state = {
            currentTime: 0.0,
            action: NONE,
            sliding: false,
        };
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    stopPlaying = async () => {
        const {sound} = this.state;
        const {width} = Dimensions.get('window');        

        if (sound != null) {
            sound.stop();
        }
        this.clearTimer();        

        this.setState({action: STOPPED});
    }
    
    clearTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    play = async () => {
        if (this.state.action === PLAYING) {
            return;
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.props.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
                else {
                    this.playSuccess();
                }
            });

            this.setState({sound: sound, currentTime: 0});

            setTimeout(() => {
                this.setState({action: PLAYING});                
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                        this.clearTimer();
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    this.setState({action: STOPPED});
                });
            }, 100);
        }, 100);
    }

    playSuccess = () => {
        const {width} = Dimensions.get('window');        
        
        this.setState({action: PLAYING});
        
        this.timer = setInterval(() => {
            this.state.sound.getCurrentTime((seconds) => {
                if (!this.state.sliding) {
                    this.setState({ currentTime: seconds }); 
                }
            });
        }, 0.5);
    }

    onSlidingStart(){
        this.setState({ sliding: true });
      }

    onSlidingChange(value) {
        let newPosition = value * this.state.sound.getDuration();
        this.setState({currentTime: newPosition});
    }
    
    onSlidingComplete() {
        this.state.sound.setCurrentTime(this.state.currentTime);
        this.setState({ sliding: false });        
    }

    render() {
        const {sound, currentTime, action} = this.state;

        const playBackValue = (sound != null) ? Math.max(currentTime/sound.getDuration(), 0) : 0;
    
        return (
            <View style={{flex:1, flexDirection:'row', alignItems:'center', paddingTop:20, paddingBottom: 20}}>
                <View style={{flex:4}}>
                    <Slider style={{marginLeft:20, marginRight:10}} 
                        thumbTintColor={niceGreen}
                        value={playBackValue}
                        onSlidingStart={ this.onSlidingStart.bind(this) }
                        onSlidingComplete={ this.onSlidingComplete.bind(this) }
                        onValueChange={ this.onSlidingChange.bind(this) }/>
                </View>
                <View style={{flex:1}}>
                    { action == PLAYING ? 
                    <Icon name='pause'
                            onPress={() => this.stopPlaying()}
                            size={35}
                            iconStyle={{color: niceGreen}}
                            containerStyle={{flex:1}}/> :
                    <Icon name='play-arrow'
                            onPress={() => this.play()}
                            size={35}
                            iconStyle={{color: niceGreen}}
                            containerStyle={{flex:1}}/>
                    }
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    controls: {
        flex:1, 
        flexDirection:'row', 
        backgroundColor:'#f2f2f2'
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
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
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    }
});

export default SoundPlayer;