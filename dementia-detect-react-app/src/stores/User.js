// @flow

import {observable, action, mobx, toJS} from 'mobx';
import {persist} from 'mobx-persist';

import Models from './models';
import Constants from '../global/Constants';
import * as api from '../api';

class Store {
    @persist('object', Models.User) @observable current = new Models.User;
    @persist @observable token = "";

    @observable patients = [];
    @observable selectedPatient = null;

    @observable selectedPatientTests = [];
    @observable selectedPatientCompletedTests = [];

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
                this.patients.push(responseJson.patient);
                this.selectedPatient = responseJson.patient;
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
                        // this.setSelectedPatient(responseJson.carerPatients[0]);
                        this.selectedPatient = responseJson.carerPatients[0];
                        await this.inflatePatientTests();
                        await this.inflatePatientCompletedTests();
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

    setSelectedPatient = async (patient) => {
        this.selectedPatient = patient;
        await this.inflatePatientTests();
        await this.inflatePatientCompletedTests();
    }

    @action inflatePatientTests = async () => {
        if (this.selectedPatient == null) {
            return;
        }
        try {
            let response = await api.getPatientTests.post({"patientId": this.selectedPatient._id});
            let responseJson = await response.json();

            this.selectedPatientTests = responseJson.tests;
            console.log('Patient tests: ');
            console.log(this.selectedPatientTests);
        } catch (error) {
            console.log(error);
        }
    };

    assignDoctor = async (patientId: string, referenceCode: string) => {
        try {
            let response = await api.assignDoctor.post({"patientId": patientId, "referenceCode": referenceCode});
            let responseJson = await response.json();

            if (responseJson.success) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    @action inflatePatientCompletedTests = async () => {
        if (this.selectedPatient == null) {
            return;
        }
        try {
            let response = await api.getCompletedPatientTests.post({"patientId": this.selectedPatient._id});
            let responseJson = await response.json();

            this.selectedPatientCompletedTests = responseJson.testResults;
            console.log('Patient completed tests: ');
            console.log(this.selectedPatientCompletedTests);
        } catch (error) {
            console.log(error);
        }
    };
}

export default new Store();