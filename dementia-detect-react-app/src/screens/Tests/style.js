import Constants  from '../../global/Constants';
import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    },
    
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
      },
    
    heading: {
        marginTop: 20,
        fontFamily: 'Helvetica Neue',
        fontSize: 16,
        textAlign: 'center',
        paddingLeft: 10,
    },
});