'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    Text,
    Button,
    TextInput,
    StyleSheet,
    Dimensions,
    Animated,
    ScrollView,
    Image
} from 'react-native';
import {inject, observer} from 'mobx-react/native';
import Camera from 'react-native-camera';
import {AudioUtils} from 'react-native-audio';
import {Icon, Card} from 'react-native-elements'

import Constants from '../../../global/Constants';
import {style} from './style';

const niceGreen = "#2ECC40";

const INSTRUCTIONS = 'instructions';
const PHOTO = 'photo';

class ImageCapture extends Component {
    constructor(props) {
        super(props);

        this.camera = null;
        const {width} = Dimensions.get('window');  
        
        const {getFilename, step} = this.props;

        this.state = {
            action: INSTRUCTIONS,
            imagePath: getFilename(step),
            camera: {
                aspect: Camera.constants.Aspect.fill,
                captureTarget: Camera.constants.CaptureTarget.disk,
                type: Camera.constants.Type.back,
                orientation: Camera.constants.Orientation.auto,
                flashMode: Camera.constants.FlashMode.auto,
            },
            x: new Animated.Value(0),
            x2: new Animated.Value(-width),
            cardX: new Animated.Value(0),
        };
    }

    takePicture = () => {
        const {setFilename, step} = this.props;

        if (this.state.action == INSTRUCTIONS) {
            this.setState({action: PHOTO});
        }
        else if (this.state.action == PHOTO) {
            if (this.camera) {
                this.camera.capture()
                    .then((data) => {
                        console.log(data);
                        this.setState({imagePath: data.path});
                        setFilename(step, data.path);
                    })
                    .catch(err => console.error(err));
            }
            this.setState({action: INSTRUCTIONS});
        }
        
    };

    switchType = () => {
        let newType;
        const {back, front} = Camera.constants.Type;

        if (this.state.camera.type === back) {
            newType = front;
        } else if (this.state.camera.type === front) {
            newType = back;
        }

        this.setState({
            camera: {
                ...this.state.camera,
                type: newType,
            },
        });
    };

    switchFlash = () => {
        let newFlashMode;
        const {auto, on, off} = Camera.constants.FlashMode;

        if (this.state.camera.flashMode === auto) {
            newFlashMode = on;
        } else if (this.state.camera.flashMode === on) {
            newFlashMode = off;
        } else if (this.state.camera.flashMode === off) {
            newFlashMode = auto;
        }

        this.setState({
            camera: {
                ...this.state.camera,
                flashMode: newFlashMode,
            },
        });
    };

    flashIcon = () => {
        let icon;
        const {auto, on, off} = Camera.constants.FlashMode;

        if (this.state.camera.flashMode === auto) {
            icon = 'flash-auto';
        } else if (this.state.camera.flashMode === on) {
            icon = 'flash-on';
        } else if (this.state.camera.flashMode === off) {
            icon = 'flash-off';
        }

        return icon;
    };

    next = () => {
        const {width} = Dimensions.get('window');
        const {next} = this.props;

        Animated.timing(this.state.cardX, {
            toValue: -width,
            duration: 300
        }).start( () => {
            next();
        });
    };

    back = () => {
        const {width} = Dimensions.get('window');        
        const {back} = this.props;

        Animated.timing(this.state.cardX, {
            toValue: width,
            speed: 300
        }).start( () => {
            back();
        });
    };

    render() {
        const {step, next, back, section} = this.props;
        const {action, sound, currentTime} = this.state;
        const {width} = Dimensions.get('window');                

        return (
            <View style={{flex:1}}>
                <View style={{flex:8}}>
                    { action == INSTRUCTIONS ?
                    <ScrollView style={{flex:1}}>
                        <Animated.View style={{flex:1, transform: [{translateX: this.state.cardX}]}}>
                            <Card title={section.instruction}>
                                <Text>{section.content}</Text>
                            </Card>
                            <Card title='Preview'>
                                {this.state.imagePath ? 
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <Image source={{uri: this.state.imagePath}}
                                        resizeMode="contain" 
                                        style={{ flex:1, width: null, height:400 }}/>
                                </View>
                                :
                                null}
                            </Card>
                        </Animated.View>
                    </ScrollView>
                    : 
                    <View style={{flex:1}}>
                        <Animated.View style={{opacity: this.state.cameraOpacity}}>
                            <Camera
                                ref={(cam) => {this.camera = cam;}}
                                style={styles.camera}
                                aspect={this.state.camera.aspect}
                                captureTarget={this.state.camera.captureTarget}
                                type={this.state.camera.type}
                                flashMode={this.state.camera.flashMode}
                                defaultTouchToFocus
                                mirrorImage={false}
                            />
                            <View style={[styles.overlay, styles.topOverlay]}>
                                <Icon name='camera-front'
                                    color={niceGreen}
                                    reverseColor={niceGreen}
                                    underlayColor='transparent'
                                    size={32}
                                    onPress={this.switchType}/>
                                <Icon name={this.flashIcon()}
                                    color={niceGreen}
                                    reverseColor={niceGreen}
                                    underlayColor='transparent'
                                    size={32}
                                    onPress={this.switchFlash}/>
                            </View>
                        </Animated.View>
                    </View>
                    }
                </View>
                <View style={styles.controls}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            {(step > 0) ? 
                                <Icon iconStyle={styles.iconBtn}
                                    size={30}
                                    name='chevron-left'
                                    onPress={() => this.back()}/> : null
                            }
                        </View>
                        <View style={{flex:4, flexDirection:'row', justifyContent:'space-around', alignItems:'center'}}>
                            <View style={{flex:1}}>
                            
                            </View>
                            <View style={{flex:1}}>
                                <Icon name='camera'
                                    containerStyle={{backgroundColor: niceGreen}}
                                    underlayColor={'white'}
                                    size={26}
                                    raised
                                    reverse
                                    onPress={this.takePicture}/>
                                </View>
                            <View style={{flex:1}}>
                            
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
                </View>
            </View>
        );
    }
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    preview: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controls: {
        flex:1, 
        flexDirection:'row', 
        backgroundColor:'#f2f2f2'
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    iconBtn: {
        height:'100%',
        paddingTop:'27%',
    },
    typeButton: {
        padding: 5,
    },
    flashButton: {
        padding: 5,
    },
    buttonsSpace: {
        width: 10,
    },
});

export default ImageCapture;