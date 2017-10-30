// @flow

import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import {inject, observer} from 'mobx-react/native';
import { List, ListItem, Icon } from 'react-native-elements';
import format from 'date-fns/format';
import Constants  from '../../global/Constants';

@inject('App', 'User') @observer
class CompletedTests extends Component {
    constructor(props) {
        super(props);
    };

    state = {
        refreshing: false
    };

    onRefresh = async () => {
        const {User} = this.props;

        this.setState({ refreshing: true });
        await User.inflatePatientCompletedTests();
        this.setState({ refreshing: false });
    };

    render() {
        const {User} = this.props;
        const {refreshing} = this.state;

        return (
            <ScrollView style={style.container}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={this.onRefresh}
                    />
                }>
                <View style={style.container}>
                    <Text style={style.heading}>View recently completed tests</Text>
                    <List containerStyle={{
                        marginBottom: 20,
                    }}>
                    {
                        User.selectedPatientCompletedTests.map((results, i) => (
                            <ListItem
                                key={results._id}
                                title={`${results.test.name} (${format(results.date, 'DD/MM/YYYY')})`}
                                subtitle={`To be reviewed by ${results.test.creator[0].firstName}`}
                                rightIcon={{name: 'more-horiz'}}
                                fontFamily='Helvetica Neue'
                            />
                        ))
                    }
                    </List>
                </View>
            </ScrollView>
        )
    }
}

export default CompletedTests;

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