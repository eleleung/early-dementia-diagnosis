import Constants  from '../../global/Constants';
import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    },

    text_input: {
        width: 250,
        height: 40,
        padding: 10,
        margin: 5,
        borderWidth: 0.5,
        borderColor: Constants.Colors.blackColor,
        borderRadius: 20,
    },

    my_background: {
        backgroundColor: '#f1f1f1'
    },

    settings_heading: {
        marginBottom: 20,
        marginTop: 20,
        fontFamily: 'Helvetica Neue',
        fontSize: 16,
        textAlign: 'center',
        paddingLeft: 10,
    },
    
    labels: {
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 3,
        height: 45,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        backgroundColor: 'white',
        fontSize: 14,
        paddingLeft: 10,
        paddingTop: 15
    },
    
    chosenPatient: {
        color: 'green'
    } 
});