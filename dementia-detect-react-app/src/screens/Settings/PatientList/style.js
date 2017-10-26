import Constants  from '../../../global/Constants';
import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    },

    my_background: {
        backgroundColor: '#f1f1f1'
    },

    heading: {
        marginTop: 20,
        fontFamily: 'Helvetica Neue',
        fontSize: 16,
        textAlign: 'left',
        paddingLeft: 10,
        textAlign: 'center'
    },

    individualPatient: {
        marginLeft: 15,
        marginBottom: 5,
        marginTop: 5,
        fontFamily: 'Helvetica Neue',
    },

    chosenPatient: {
        color: 'green'
    } 
});