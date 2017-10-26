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
        icon         : Images.HOME_TAB,
        selectedIcon : Images.HOME_TAB_SELECTED,
    },
    INFORMATION_SCREEN: {
        screen       : 'app.InformationScreen',
        title        : 'Info',
        label        : 'Information',
    },
    COMPLETED_TESTS_SCREEN: {
        screen       : 'app.CompletedTestsScreen',
        title        : 'Completed Tests',
        label        : 'Completed Tests',
        icon         : Images.COMPLETED_TESTS_TAB,
        selectedIcon : Images.COMPLETED_TESTS_TAB_SELECTED
    },
    TESTS_SCREEN: {
        screen       : 'app.TestsScreen',
        title        : 'Assigned Tests',
        label        : 'Assigned Tests',
        icon         : Images.ASSIGNED_TESTS_TAB,
        selectedIcon : Images.ASSIGNED_TESTS_TAB_SELECTED
    },
    TEST_SCREEN: {
        screen       : 'app.TestScreen',
        title        : 'Test',
    },
    SETTINGS_SCREEN: {
        screen       : 'app.SettingsScreen',
        title        : 'Settings',
        label        : 'Settings',
        icon         : Images.SETTINGS_TAB,
        selectedIcon : Images.SETTINGS_TAB_SELECTED
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
