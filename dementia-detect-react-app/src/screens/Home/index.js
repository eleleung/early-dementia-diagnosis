// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { List, ListItem, Icon } from 'react-native-elements';

import NavButtons from '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';

const win = Dimensions.get('window');

@inject('App', 'User') @observer
class Home extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {

    }
    
    render() {
        const { User } = this.props;

        return (
            <ScrollView style={style.container}>
                <Text style={style.heading}>Your Stats</Text>
                <List>
                    <ListItem
                        title={'Completed Tests'}
                        leftIcon={{name: 'done'}}
                        hideChevron={true}
                        badge={{ value: 0, textStyle: { color: 'white' }, containerStyle: { backgroundColor: 'green' } }}/>
                    <ListItem
                        title={'Assigned Tests'}
                        leftIcon={{name: 'assessment'}}
                        hideChevron={true}
                        badge={{ value: 0, textStyle: { color: 'white' }, containerStyle: { backgroundColor: 'orange' } }}/>
                </List>

                <Text style={style.heading}>News</Text>
                <List >
                    <ListItem
                        title={'Blood-thinning drugs can reduce risk of dementia by up to 48%'}
                        titleNumberOfLines={2}
                        subtitle={
                            <View style={{marginTop: 10}}>
                                <Image style={{width: win.width - 20, height: 200, }} source={require('../../../img/blood.jpg')}/>
                                <Text style={{marginTop:5}}>Research ‘strongly suggests’ that patients taking anticoagulants for irregular heartbeat could be protected against dementia and stroke</Text>
                            </View>
                        }
                        subtitleNumberOfLines={4}/>
                    <ListItem
                        title={'Anti-stroke drugs may cut dementia risk by half'}
                        titleNumberOfLines={2}
                        subtitle={
                            <View style={{marginTop: 10}}>
                                <Image style={{width: win.width - 20, height: 200, }} source={require('../../../img/drugs.jpg')}/>
                                <Text style={{marginTop:5}}>Blood-thinning drugs taken to prevent strokes may dramatically reduce the risk of dementia, a study has found.</Text>
                            </View>
                        }
                        subtitleNumberOfLines={4}/>
                    <ListItem
                        leftIcon={{name: 'library-books'}}
                        title={'More'}/>
                </List>

                <Text style={style.heading}>Upcoming Trials</Text>
                <List  containerStyle={{ marginBottom: 20 }}>
                    <ListItem
                        title={'Sodium Selenate as a treatment for patients with possible behavioural-variant Fronto-Temporal Dementia'}
                        titleNumberOfLines={3}
                    />
                    <ListItem
                        title={'The effect of high-intensity exercise on cognitive function in healthy older adults'}
                        titleNumberOfLines={3}/>
                    <ListItem
                        leftIcon={{name: 'library-books'}}
                        title={'More'}/>
                </List>
            </ScrollView>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,        
    },    
    heading: {
        marginTop: 20,
        fontFamily: 'Helvetica Neue',
        fontSize: 16,
        textAlign: 'center',
        paddingLeft: 10,
    },
});    

export default Home;

