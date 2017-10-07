import Constants  from '../../global/Constants';
import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    },

    button: {
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 5,
        height: 40,
        color: 'white',
        borderWidth: 0
    },
    
    textField: {
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 5,
        height: 40,
        borderWidth:1,
        borderColor: 'rgba(255,255,255, 0.4)',
        backgroundColor: 'white',
        fontSize: 14
    },
    
    valid: {
        borderColor: 'rgb(225, 255, 225)',
        backgroundColor: 'rgb(245, 255, 245)'
    },
    
    error: {
        borderColor: 'rgb(255, 225, 225)',
        backgroundColor: 'rgb(255, 240, 240)',
    },
    
    primaryButton: {
        color: 'white',
        backgroundColor: '#67c581',
        marginBottom: 75
    },
    
    minorButton: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 250,
        backgroundColor: 'rgba(255,255,255, 0.5)',
        color: '#848484',
        height: 50,
    },
    
    formTitle: {
        marginTop: 80,
        marginBottom: 20,
        textAlign: 'center',
        color: '#848484'
    },
    
    genderBar: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: 'white',
        borderColor: '#f1f1f1',
        color: 'grey',
        fontSize: 14,
    }
});