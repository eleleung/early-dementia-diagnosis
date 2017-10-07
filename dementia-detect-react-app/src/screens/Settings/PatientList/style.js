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
        marginLeft: 10,
        marginTop: 10,
        fontFamily: 'Helvetica Neue',
        fontSize: 15,
        textAlign: 'left',
        paddingLeft: 10,
        fontWeight: 'bold'        
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