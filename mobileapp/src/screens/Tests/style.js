import Constants  from '../../global/Constants';
import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.Colors.backgroundColor,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
      },
});