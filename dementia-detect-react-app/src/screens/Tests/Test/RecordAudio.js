import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
    ScrollView,
    Dimensions,
    Animated
} from 'react-native';
import { Button, Icon, Card, Slider } from 'react-native-elements'

import { inject, observer } from 'mobx-react/native';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

import Constants  from '../../../global/Constants';
import {style} from './style';

const niceGreen = "#2ECC40";

const PLAYING = 'playing';
const PAUSED = 'paused';
const STOPPED = 'stopped';
const RECORDING = 'recording';
const NONE = 'none';


class RecordAudio extends Component {

    constructor(props: Props) {
        super(props);

        const {section, testId, filePath} = this.props;
        const {width} = Dimensions.get('window');                        
        
        this.state = {
            currentTime: 0.0,
            action: NONE,
            audioPath: filePath + `/id=${testId}-section=${section.id}.aac`,
            hasPermission: undefined,
            x: new Animated.Value(0),
            x2: new Animated.Value(-width),
            cardX: new Animated.Value(0),
            sliding: false,
        };
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {
        this._checkPermission().then((hasPermission) => {
            this.setState({ hasPermission });

            if (!hasPermission) return;

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL);
                }
            };
        });
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    _checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': 'Microphone Permission',
            'message': 'Dementia Detect needs access to your microphone so you can record audio.'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
        .then((result) => {
            console.log('Permission result:', result);
            return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
        });
    }

    pause = async () => {
        if (this.state.action === RECORDING) {
            this.setState({action: PAUSED});
            
            try {
                const filePath = await AudioRecorder.pauseRecording();
    
                // Pause is currently equivalent to stop on Android.
                if (Platform.OS === 'android') {
                    this._finishRecording(true, filePath);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    stopRecording = async () => {
        if (this.state.action !== RECORDING) {
            return;
        }

        this.setState({action: STOPPED});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    stopPlaying = async () => {
        const {sound} = this.state;
        const {width} = Dimensions.get('window');        
        
        Animated.spring(this.state.x, {
            toValue: 0,
            speed: 10
        }).start();
        Animated.spring(this.state.x2, {
            toValue: -width,
            speed: 10
        }).start();

        sound.stop();
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
        if (this.state.action === RECORDING) {
            await this.stopRecording();
        }

        if (this.state.action === PLAYING) {
            return;
        }

        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
                else {
                    this.playSuccess();
                }
            });

            this.setState({sound: sound, currentTime: 0});

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    this.setState({action: PLAYING});                    
                });
            }, 100);
        }, 100);
    }

    playSuccess = () => {
        const {width} = Dimensions.get('window');        
        
        this.setState({action: PLAYING});
        
        Animated.spring(this.state.x, {
            toValue: width,
            speed: 10
        }).start();
        Animated.spring(this.state.x2, {
            toValue: 0,
            speed: 10
        }).start();
        
        this.timer = setInterval(() => {
            this.state.sound.getCurrentTime((seconds) => {
                if (!this.state.sliding) {
                    this.setState({ currentTime: seconds }); 
                }
            });
        }, 0.5);
    }

    record = async () => {
        if (this.state.action === RECORDING) {
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        this.prepareRecordingPath(this.state.audioPath);

        this.setState({action: RECORDING});

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording(didSucceed, filePath) {
        this.setState({ action: NONE });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
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

    next = () => {
        const {width} = Dimensions.get('window');
        const {next} = this.props;

        Animated.timing(this.state.cardX, {
            toValue: -width,
            duration: 300
        }).start( () => {
            next();
        });
    }

    back = () => {
        const {width} = Dimensions.get('window');        
        const {back} = this.props;

        Animated.timing(this.state.cardX, {
            toValue: width,
            speed: 300
        }).start( () => {
            back();
        });
    }

    render() {
        const {step, next, back, section} = this.props;
        const {action, sound, currentTime} = this.state;
        const {width} = Dimensions.get('window');                

        const backBtn = (step > 0) ? 
            <Icon iconStyle={styles.iconBtn}
                size={30}
                name='chevron-left'
                onPress={() => this.back()}/> : null;

        const recordBtn = action === RECORDING ?
            <Icon name='pause'
                containerStyle={{backgroundColor: niceGreen}}
                underlayColor={'white'}
                onPress={() => this.stopRecording()}
                size={26}
                raised
                reverse/> :
            <Icon name='keyboard-voice'
                containerStyle={{backgroundColor: niceGreen}}
                underlayColor={'white'}
                onPress={() => this.record()}
                size={26}
                raised
                reverse/> 

        const playBackValue = (sound != null) ? Math.max(currentTime/sound.getDuration(), 0) : 0;
    
        return (
            <View style={{flex:1}}>
                <View style={{flex:8}}>
                    <ScrollView style={{flex:1}}>
                        <Animated.View style={{transform: [{translateX: this.state.cardX}]}}>
                            <Card title={section.instruction}>
                                <Text>{section.content}</Text>
                            </Card>
                        </Animated.View>
                    </ScrollView>
                </View>
                <View style={styles.controls}>
                    <Animated.View style={[{width:'100%'},{transform: [{translateX: this.state.x}]}]}>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <View style={{flex:1}}>
                                {backBtn}
                            </View>
                            <View style={{flex:4, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                                <View style={{flex:1}}>
                                
                                </View>
                                <View style={{flex:1}}>
                                    {recordBtn}
                                </View>
                                <View style={{flex:1}}>
                                    <Icon name='play-arrow'
                                        onPress={() => this.play()}
                                        size={35}
                                        iconStyle={{color: niceGreen}}
                                        containerStyle={{flex:1}}
                                        /> 
                                </View>
                            </View>
                            <View style={{flex:1}}>
                                <Icon 
                                    containerStyle={{borderWidth:0}}
                                    iconStyle={styles.iconBtn}
                                    size={30}
                                    name='chevron-right'
                                    onPress={() => this.next()}/>
                            </View>
                        </View>
                    </Animated.View>
                    {this.state.action == PLAYING ?  
                    <Animated.View style={[{left: -width, width:width},{transform: [{translateX: this.state.x2}]}]}>
                        <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>
                            <View style={{flex:4}}>
                                <Slider style={{marginLeft:20, marginRight:10}} 
                                    thumbTintColor={niceGreen}
                                    value={playBackValue}
                                    onSlidingStart={ this.onSlidingStart.bind(this) }
                                    onSlidingComplete={ this.onSlidingComplete.bind(this) }
                                    onValueChange={ this.onSlidingChange.bind(this) }/>
                            </View>
                            <View style={{flex:1}}>
                                <Icon name='pause'
                                        onPress={() => this.stopPlaying()}
                                        size={35}
                                        iconStyle={{color: niceGreen}}
                                        containerStyle={{flex:1}}/> 
                            </View>
                        </View>
                    </Animated.View>
                    : null }
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

export default RecordAudio;