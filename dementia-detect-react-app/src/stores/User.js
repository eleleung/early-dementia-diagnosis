// @flow

import {observable, action, mobx} from 'mobx';
import {persist} from 'mobx-persist';

import Models from './models';
import Constants from '../global/Constants';
import * as api from '../api';

class Store {
    @persist('object', Models.User) @observable current = new Models.User;
    @persist @observable token = "";

    @observable patients = [];
    @observable selectedPatient = new Models.Patient;

    @action login = async (email: string, password: string) => {
        try {
            let response = await api.login.post({email: email, password: password});
            if (response.ok) {
                let responseJson = await response.json();

                this.token = responseJson.token;
                this.current = responseJson.user;
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    @action register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
            let response = await api.register.post({firstName: firstName, lastName: lastName, email: email, password: password});
            return response.ok;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    @action logout = () => {
        this.token = "";
        this.current = null;
    };

    @action registerPatient = async (patient: Models.Patient) => {
        try {
            let response = await api.registerPatient.post(patient);
            if (response.ok) {
                let responseJson = await response.json(); 

                return true;
            } else {
                return false;
            }  
        } catch (error) {
            return false;
        }
    }

    @action getPatients = async () => {
        if (this.token && this.current) {
            try {
                let response = await api.getAllPatients.get()
                if (response.ok) {
                    let responseJson = await response.json();
                    this.patients = responseJson.carerPatients;
                    
                    if (responseJson.carerPatients.length > 0) {
                        this.selectedPatient = responseJson.carerPatients[0];

                        // then get patient tests?
                        this.selectedPatient.tests = await getPatientTests(this.selectedPatient._id);
                    }
                    return true;
                } else {
                    return false;
                }                
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    };

    getPatientTests = async (patientId: string) => {
        try {
            let response = await api.getPatientTests.post({"_id": patientId});
            let responseJson = await response.json();

            if (responseJson.ok) {
                return responseJson.tests;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    };
}

export default new Store();
