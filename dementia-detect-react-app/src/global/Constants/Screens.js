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
        title        : 'Home',
        label        : 'Home',
    },
    INFORMATION_SCREEN: {
        screen       : 'app.InformationScreen',
        title        : 'Info',
        label        : 'Information',
    },
    TESTS_SCREEN: {
        screen       : 'app.TestsScreen',
        title        : 'Tests',
        label        : 'Tests',
    },
    TEST_SCREEN: {
        screen       : 'app.TestScreen',
        title        : 'Test',
    },
    SETTINGS_SCREEN: {
        screen       : 'app.SettingsScreen',
        title        : 'Settings',
        label        : 'Settings'
    },

    ADD_PATIENT_SCREEN: {
        screen       : 'app.AddPatientScreen',
        title        : 'Add Patient',
    },

    PATIENT_LIST_SCREEN: {
        screen       : 'app.PatientListScreen',
        title        : 'Patient List'
    }
}
