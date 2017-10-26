// @flow

import URI from 'urijs';
import stores from '../stores';

async function url(path, apiHost = 'localhost:3000') {
    return URI(`http://${apiHost || 'localhost:3000'}`).path(path).toString();    
}

function endpoint(path, withAuth = true) {
    return {
        async get() {
            const endpointUrl = await url(
                path,
            );

            const result = await fetch(endpointUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: withAuth ? stores.User.token : null
                }
            });

            return result;
        },
        async post(body) {
            const endpointUrl = await url(
                path,
            );
            
            const result = await fetch(endpointUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: withAuth ? stores.User.token : null
                },
                body: JSON.stringify(body)
            });

            return result;
        }
    };
}

export const resetPassword = endpoint('/users/reset-password', false);
export const registerPatient = endpoint('/patients/register');
export const getAllPatients = endpoint('/users/getPatients');
export const getPatientTests = endpoint('/tests/getPatientTests');
export const login = endpoint('/users/authenticate', false);
export const register = endpoint('/users/register', false);
export const assignDoctor = endpoint('/doctors/assign-doctor');
export const getCompletedPatientTests = endpoint('/test-results/getCompletedPatientTests');