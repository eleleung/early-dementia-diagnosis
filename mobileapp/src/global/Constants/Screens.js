// @flow

import Images from './Images';
import stores from '../../stores';

export default {
    LOGIN_SCREEN: {
        screen : 'app.LoginScreen',
        title  : 'Login',
    },

    REGISTER_SCREEN: {
        screen : 'app.RegisterScreen',
        title  : 'Create Account',
    },

    HOME_SCREEN: {
        screen       : 'app.TabbedHomeScreen',
        title        : '',
        label        : 'Home',
        icon         : Images.TAB_1,
        selectedIcon : Images.TAB_1_selected,
    },
    INFORMATION_SCREEN: {
        screen       : 'app.InformationScreen',
        title        : '',
        label        : 'Information',
        icon         : Images.TAB_1,
        selectedIcon : Images.TAB_1_selected
    },
    TESTS_SCREEN: {
        screen       : 'app.TestsScreen',
        title        : '',
        label        : 'Tests',
        icon         : Images.TAB_1,
        selectedIcon : Images.TAB_1_selected
    },
    SETTINGS_SCREEN: {
        screen       : 'app.SettingsScreen',
        title        : '',
        label        : 'Settings',
        icon         : Images.TAB_1,
        selectedIcon : Images.TAB_1_selected,
    },

    ADD_PATIENT_SCREEN: {
        screen       : 'app.AddPatientScreen',
        title        : '',
    },
}
