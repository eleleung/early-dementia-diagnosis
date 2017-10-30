// @flow

import { Navigation } from 'react-native-navigation';
import Constants from '../global/Constants';
import LoginScreen      from './LoginScreen';
import RegisterScreen   from './Register';
import Home             from './Home';
import Settings         from './Settings';
import Information      from './Information';
import Tests            from './Tests';
import Test             from './Tests/Test';
import AddPatient       from './AddPatient';
import PatientList      from './Settings/PatientList';
import CompletedTests   from './CompletedTests';

export function registerScreens(store: {}, Provider: {}) {    
    Navigation.registerComponent(Constants.Screens.LOGIN_SCREEN.screen,  () => LoginScreen, store, Provider);
    Navigation.registerComponent(Constants.Screens.REGISTER_SCREEN.screen,  () => RegisterScreen, store, Provider);
    
    Navigation.registerComponent(Constants.Screens.HOME_SCREEN.screen,   () => Home, store, Provider);
    Navigation.registerComponent(Constants.Screens.SETTINGS_SCREEN.screen, () => Settings, store, Provider);
    Navigation.registerComponent(Constants.Screens.TESTS_SCREEN.screen, () => Tests, store, Provider);
    Navigation.registerComponent(Constants.Screens.TEST_SCREEN.screen, () => Test, store, Provider);
    Navigation.registerComponent(Constants.Screens.COMPLETED_TESTS_SCREEN.screen, () => CompletedTests, store, Provider);

    Navigation.registerComponent(Constants.Screens.INFORMATION_SCREEN.screen, () => Information, store, Provider);

    Navigation.registerComponent(Constants.Screens.ADD_PATIENT_SCREEN.screen, () => AddPatient, store, Provider);
    Navigation.registerComponent(Constants.Screens.PATIENT_LIST_SCREEN.screen, () => PatientList, store, Provider);
}
