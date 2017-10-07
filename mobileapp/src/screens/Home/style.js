import Constants  from '../../global/Constants';
import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Constants.Colors.backgroundColor,
    },
    form: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      text_input: {
        width: 250,
        height: 40,
        padding: 10,
        margin: 5,
    
        borderWidth: 0.5,
        borderColor: Constants.Colors.blackColor,
        borderRadius: 20,
      }
});

