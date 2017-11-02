
import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import {inject, observer} from 'mobx-react/native';
import {toJS} from 'mobx';

import Constants  from '../../../global/Constants';
import * as api from '../../../api';
import {style} from './style';

@inject('App', 'User') @observer
class PatientList extends Component {
    constructor(props) {
        super(props);
    };

    changeSelectedPatient = (item) => {
        const {User} = this.props;
        
        User.setSelectedPatient(item);
    };    

    render() {
        const {User} = this.props;
    
        return (
            <ScrollView style={style.container}>
                <Text style={style.heading}>Tap to switch patient</Text>
                <List containerStyle={{marginBottom: 20}}>
                {
                User.patients.map((item, i) => (
                    User.selectedPatient._id === item._id ?
                    <ListItem
                        key={i}
                        title={`${item.firstName} ${item.lastName}`}
                        rightIcon={{name: 'check'}}
                        onPress={() => this.changeSelectedPatient(item)}
                    />
                    :
                    <ListItem
                        key={i}
                        title={`${item.firstName} ${item.lastName}`}
                        hideChevron={true}
                        onPress={() => this.changeSelectedPatient(item)}
                    />
                ))
                }
            </List>
          </ScrollView>
        )
    }
}

export default PatientList;