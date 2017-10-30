
/**
 * Created by caitlinwoods on 29/10/17.
 */
let should = require('should');
let assert = require('assert');
let request = require('supertest');
let mongoose = require('mongoose');
let winston = require('winston');
let config = require('debug');
let express = require('express');
app = express();
let server = require('../app.test');
const User = require('../models/user');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Test = require('../models/test');
jwt = require('jsonwebtoken');
let ObjectId = require('mongoose').ObjectId;
const TestResult = require('../models/test_result');

describe('Test Results', function() {

    beforeEach(function (done) {

        console.log("cleaning database");
        User.removeUsers(function (err) {
            if (err) {
                throw err;
            }
        });
        Doctor.removeDoctors(function (err) {
            if (err) {
                throw err;
            }
        });
        Test.removeTests(function (err) {
            if (err) {
                throw err;
            }
        });
        Patient.removePatients(function (err) {
            if (err) {
                throw err;
            }
        });
        TestResult.removeTestResults(function (err) {
            if (err) {
                throw err;
            }
        });
        done()
    });

    describe("Get completed patient tests", function () {

        /**
         * Test Case: Patients - Register - FRD12 valid request - FRD12 should retrieve test results"
         * Purpose: To test that test results can be retreived
         * Expected outcome: Sucessfull response with tests retreived
         */
        describe("FRD12 valid request", function () {

            it("FRD12 should retrieve test results", function (done) {

                //add test results for patient
                this.timeout(30000);
                //Add test results to database

                //add user
                let newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "email@email.com",
                    password: "password",
                    dateOfBirth: ''
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                    }
                    else {

                        this.user = user;

                        this.userId = user._id;

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: [user._id]
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);

                            }
                            else {

                                let testComponents = [];
                                const component = {
                                    type: 'audio',
                                    instruction: '',
                                    content: ''
                                };
                                component.instruction = 'Example: Press record and read the text aloud';
                                component.content = 'A quick brown fox jumps over the lazy dog';

                                testComponents.push(component);


                                const newTest = new Test({
                                    name: "Test Name",
                                    description: "Description",
                                    components: testComponents,
                                    dateCreated: new Date(),
                                    creator: user._id
                                });

                                Test.addTest(newTest, function (err, test) {
                                    if (err) {
                                        console.log('error :' + err);

                                        this.testId = test._id;

                                    }
                                    else {


                                        patient.tests.push(test._id);

                                        // add test to patient
                                        Patient.updatePatient(patient, function (err, res) {
                                            if (err) {
                                                console.log('error :' + err);

                                            }
                                            else {

                                                this.patientId = patient._id;

                                                let testResult = new TestResult({
                                                    test: mongoose.Types.ObjectId(this.testId),
                                                    componentResults: [{type: "new results"}],
                                                    creator: mongoose.Types.ObjectId(this.userId),
                                                    patient: mongoose.Types.ObjectId(this.patientId),
                                                    date: new Date()
                                                });

                                                console.log(this.patientId)

                                                TestResult.addTestResult(testResult, function (err, test) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                        console.log('successful add');

                                                        request(server)
                                                            .post('/test-results/getCompletedPatientTests/')
                                                            .set('Authorization', 'JWT ' + jwt.sign(this.user, 'yoursecret'))
                                                            .send({"patientId": this.patientId})
                                                            // end handles the response
                                                            .end(function (err, res) {
                                                                if (err) {
                                                                    throw err;
                                                                }
                                                                // should be successful
                                                                console.log(this.patientId);

                                                                console.log(res.text)
                                                                assert.equal(res.statusCode, 200);

                                                                done();
                                                            });
                                                    }
                                                });

                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                });

            });

        });

        /**
         * Test Case: Patients - Register - FRD12 invalid request with incorrect patientId - FRD12 should return an error"
         * Purpose: To test that test results cann0t be retreived for an invalid patient
         * Expected outcome: Unsuccessful response with no tests retreived
        */
        describe("FRD12 invalid request with incorrect patientId", function () {

            it("FRD12 should return an error", function (done) {

                //add test results for patient
                this.timeout(30000);
                //Add test results to database

                //add user
                let newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "email@email.com",
                    password: "password",
                    dateOfBirth: ''
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                    }
                    else {

                        this.user = user;

                        this.userId = user._id;

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: [user._id]
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);

                            }
                            else {

                                let testComponents = [];
                                const component = {
                                    type: 'audio',
                                    instruction: '',
                                    content: ''
                                };
                                component.instruction = 'Example: Press record and read the text aloud';
                                component.content = 'A quick brown fox jumps over the lazy dog';

                                testComponents.push(component);


                                const newTest = new Test({
                                    name: "Test Name",
                                    description: "Description",
                                    components: testComponents,
                                    dateCreated: new Date(),
                                    creator: user._id
                                });

                                Test.addTest(newTest, function (err, test) {
                                    if (err) {
                                        console.log('error :' + err);

                                        this.testId = test._id;

                                    }
                                    else {


                                        patient.tests.push(test._id);

                                        // add test to patient
                                        Patient.updatePatient(patient, function (err, res) {
                                            if (err) {
                                                console.log('error :' + err);

                                            }
                                            else {

                                                this.patientId = patient._id;

                                                let testResult = new TestResult({
                                                    test: mongoose.Types.ObjectId(this.testId),
                                                    componentResults: [{type: "new results"}],
                                                    creator: mongoose.Types.ObjectId(this.userId),
                                                    patient: mongoose.Types.ObjectId(this.patientId),
                                                    date: new Date()
                                                });

                                                console.log(this.patientId)

                                                TestResult.addTestResult(testResult, function (err, test) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                        console.log('successful add');

                                                        request(server)
                                                            .post('/test-results/getCompletedPatientTests/')
                                                            .set('Authorization', 'JWT ' + jwt.sign(this.user, 'yoursecret'))
                                                            .send({"patientId": ""}) //NO PATIENT ID
                                                            // end handles the response
                                                            .end(function (err, res) {
                                                                if (err) {
                                                                    throw err;
                                                                }
                                                                // should be successful
                                                                assert.equal(res.statusCode, 400);
                                                                assert.equal(res.text, '{"success":false,"msg":"Could not find test result for patient"}')

                                                                done();
                                                            });
                                                    }
                                                });

                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                });

            });

        });
    });
});