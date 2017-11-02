/**
 * Created by caitlinwoods on 29/10/17.
 */
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

//For adding a new patient to the app and assigning to a carer
describe('Patients', function () {

    beforeEach(function () {

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
    });

    describe("Register", function () {

        /**
         * Test Case: Patients - Register - FRC04 valid request - FRC04 should register patient
         * Purpose: to test that a carer can make a request to register a new patient
         * Expected Outcome: Successful (200) response is returned and the user is registered
         */
        describe("FRC04 valid request", function () {

            it("FRC04 should register patient", function (done) {

                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {
                        //console.log('user :' + user);

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        request(server)
                            .post('/patients/register/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send(newPatient)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }

                                console.log(res.body);
                                assert.equal(res.body.patient.lastName, 'patientLastName');
                                assert.equal(res.body.patient.firstName, 'patientFirstName');
                                assert.equal(res.body.patient.gender, 'Female');
                                assert.equal(res.statusCode, 200);
                                done();
                            });
                    }
                });
            });
        });

        /**
         * Test Case: Patients - Register - FRC04 invalid request no sirname in request - FRC04 should return 400 status and not register patient
         * Purpose: to test that a carer should not be able to send an "AddPatient" request with no sirname
         * Expected Outcome: Unsuccessful (200) response is returned and the user is not registered
         */
        describe("FRC04 invalid request no sirname in request", function () {

            it("FRC04 should return 400 status and not register patient", function (done) {
                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: ''
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {
                        //console.log('user :' + user);

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            gender: "Female",
                            dateOfBirth: "1957-01-09T16:00:00.000Z",
                            carers: []
                        });

                        request(server)
                            .post('/patients/register/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send(newPatient)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                //todo: do more thorough assert
                                assert.equal(res.text, '{"success":false,"msg":"Failed to register patient"}');
                                assert.equal(res.statusCode, 400);
                                done();
                            });
                    }
                });
            });
        });

        /**
         * Test Case: Patients - Register - FRC04 invalid request empty sirname in request - FRC04 should return 400 status and not register patient
         * Purpose: to test that a carer should not be able to send an "AddPatient" request with an empty sirname
         * Expected Outcome: Unsuccessful (200) response is returned and the user is not registered
         */
        describe("FRC04 invalid request empty sirname in request", function () {

            it("FRC04 should return 400 status no registered patient", function (done) {
                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: ''
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        request(server)
                            .post('/patients/register/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send(newPatient)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }

                                assert.equal(res.text, '{"success":false,"msg":"Failed to register patient"}');
                                assert.equal(res.statusCode, 400);
                                done();
                            });
                    }
                });
            });
        });

        /**
         * Test Case: Patients - Register - FRC04 invalid request invalid JWT token - FRC04 should return a 401 unauthorised response
         * Purpose: To test that a if an invalid JWT token is passed to AddPatient, an unauthorised response is returned
         * Expected outcome: An Unauthorised (401) response should be returned
         */
        describe("FRC04 invalid request invalid JWT token", function () {

            it("FRC04 should return 401 status with Unauthorised response", function (done) {
                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        //ACT: send request
                        request(server)
                            .post('/patients/register/')
                            .set('Authorization', 'invalid')
                            .send(newPatient)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }

                                assert.equal(res.text, 'Unauthorized');
                                assert.equal(res.statusCode, 401);
                                done();
                            });
                    }
                });
            });

        });
    });

    describe("GetPatientById", function() {

        /**
         * Test Case: Patients - Register - FRC05 valid request - FRC05 should get correct patient"
         * Purpose: To test that a patient can be retrieved from the database by their ID
         * Expected outcome: The patient should be returned successfully
         */
        describe("FRC05 valid request", function() {
            it("FRC05 should get correct patient", function(done) {
                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);
                                done();
                            }
                            else {

                                //ACT: Get patient by ID
                                request(server)
                                    .post('/patients/getPatientById/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                    .send(patient)
                                    // end handles the response
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        assert.equal(res.body.msg, 'Patient Found');
                                        assert.equal(res.statusCode, 200);
                                        assert.equal(res.body.patient.firstName, 'patientFirstName');
                                        assert.equal(res.body.patient.lastName, 'patientLastName');
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        /**
         * Test Case: Patients - Register - FRC05 call getPatientById with no patient id - FRC05 should return a 400 response and not retrieve a patient"
         * Purpose: To test that if the patient is not sent through, the call is unsuccessful
         * Expected outcome: A 400 respone is returned with "Patient not found" messgae
         */
        describe("FRC05 call getPatientById with no patient id", function() {
            it ("FRC05 should return a 400 response and not retrieve a patient", function(done) {
                this.timeout(20000);

                User.removeUsers(function (err) {
                    if (err) {
                        throw err;
                    }
                });

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);
                                done();
                            }
                            else {
                                //ACT: Get patient by ID
                                request(server)
                                    .post('/patients/getPatientById/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                    // end handles the response
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        assert.equal(res.body.msg, 'Failed to find patient');
                                        assert.equal(res.statusCode, 400);
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });

        /**
         * Test Case: Patients - Register - FRC05 call getPatientById with invalid JWT token - FRC05 should return a 401 unauthorised response"
         * Purpose: To test that a patient cannot be retrieved if call is unauthorised
         * Expected outcome: A 401 Unauthorised response should be returned
         */
        describe("FRC05 call getPatientById with invalid JWT token", function() {

            it("FRC05 should return a 401 unauthorised response", function(done) {

                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);
                                done();
                            }
                            else {

                                //ACT: Get patient by ID
                                request(server)
                                    .post('/patients/getPatientById/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'invalid'))
                                    .send(patient)
                                    // end handles the response
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        assert.equal(res.text, 'Unauthorized');
                                        assert.equal(res.statusCode, 401);
                                        done();
                                    });
                            }
                        });
                    }
                });
            });
        });
    });

    describe("Add-Patient-Test", function() {

        beforeEach(function(done) {

            this.timeout(20000);

            var newUser = new User({
                firstName: "firstName",
                lastName: "lastName",
                email: "doctor@gmail.com",
                password: "password",
                dateOfBirth: '1957-01-09T16:00:00.000Z'
            });

            //add user
            User.addUser(newUser, function (err, user) {
                if (err) {
                    console.log('error :' + err);
                    done();
                }
                else {

                    var testComponents = [];
                    var component = {
                        type: 'audio',
                        instruction: '',
                        content: ''
                    };
                    component.instruction = 'Example: Press record and read the text aloud';
                    component.content = 'A quick brown fox jumps over the lazy dog';
                    testComponents.push(component);

                    var newTest = new Test({
                        name: "Test Name",
                        description: "Description",
                        components: testComponents,
                        dateCreated: "1957-01-09T16:00:00.000Z",
                        creator: mongoose.Types.ObjectId(user._id)
                    });

                    Test.addTest(newTest, function (err, res) {
                        if (err) {
                            console.log('error :' + err);
                            done();
                        }
                        this.testId = res._id;
                        done();
                    });
                }
            });
        });

        /**
         * Test Case: Patients - Register - FRC11 valid request - FRD11 should assign test to patient successfullyFRC05 should get correct patient"
         * Purpose: To test that a test can be assigned to a patient
         * Expected outcome: The patient is updated with the new test
         */
        describe("FRD11 valid request", function() {

            it("FRD11 should assign test to patient successfully", function(done) {

                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);
                                done();
                            }
                            else {

                                console.log(patient);

                                //ACT: Assign test to patient
                                 request(server)
                                 .post('/patients/add_patient_test/')
                                 .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                 .send({"patientId": patient._id, "testId": this.testId})
                                 // end handles the response
                                 .end(function (err, res) {
                                 if (err) {
                                 throw err;
                                 }

                                 console.log(res.body);
                                 assert.equal(res.body.msg, 'Patient updated');
                                 assert.equal(res.status, 200);
                                 assert.equal(res.body.patient._id, patient._id);
                                 assert.equal(res.body.patient.tests[0].id, this.testId);
                                 done();
                                 });
                            }
                        });
                    }
                });
            });
        });

        /**
         * Test Case: Patients - Register - FRD11 invalid request with incorrect patientId - FRD11 should return 400 response and not assign test to patient"
         * Purpose: To test that a test cannot be assigned to an invalid patient
         * Expected outcome: A 400 error response is received
         */
        describe("FRD11 invalid request with incorrect patientId", function() {

            it("FRD11 should return 400 response and not assign test to patient", function(done) {

                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);
                                done();
                            }
                            else {

                                //ACT: Assign test to patient
                                request(server)
                                    .post('/patients/add_patient_test/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                    .send({"patientId": "invalid", "testId": this.testId}) //invalid patient id
                                    // end handles the response
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        console.log(res.body);
                                        assert.equal(res.body.msg, 'Failed to load patient');
                                        assert.equal(res.status, 400);
                                        done();
                                    });
                            }
                        });
                    }
                });
            });

        });

        /**
         * Test Case: Patients - Register - FRD11 invalid request with invalid JWT token - FRD11 should return 401 unauthorised reponse"
         * Purpose: To test that a test cannot be assigned if the user is unauthorised
         * Expected outcome: A 401 unauthorised response is received
         */
        describe("FRD11 invalid request with invalid JWT token", function() {

            it("FRD11 should return 401 unauthorised reponse", function(done) {

                this.timeout(20000);

                var newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: '1957-01-09T16:00:00.000Z'
                });

                //add user
                User.addUser(newUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        var newPatient = new Patient({
                            firstName: "patientFirstName",
                            lastName: "patientLastName",
                            gender: "Female",
                            dateOfBirth: "",
                            carers: []
                        });

                        Patient.addPatient(newPatient, function (err, patient) {
                            if (err) {
                                console.log('error :' + err);
                                done();
                            }
                            else {

                                console.log(patient);

                                //ACT: Assign test to patient
                                request(server)
                                    .post('/patients/add_patient_test/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'invalid')) //invalid JWT token
                                    .send({"patientId": patient._id, "testId": this.testId})
                                    // end handles the response
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        assert.equal(res.text, 'Unauthorized');
                                        assert.equal(res.status, 401);
                                        done();
                                    });
                            }
                        });
                    }
                });
            });

        });
    });
});