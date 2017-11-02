/**
 * Created by caitlinwoods on 30/10/17.
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


//For creating tests
describe('Tests', function() {

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

    describe('SaveTest', function () {

        beforeEach(function (done) {

            this.timeout(20000);

            //Add a doctor
            let newUser = {
                firstName: "firstName",
                lastName: "lastName",
                email: "email@email.com",
                password: "password",
                confirm_password: "password"
            };

            request(server)
                .post('/doctors/register/')
                .send(newUser)
                // end handles the response
                .end(function (err, res, next) {
                    if (err) {
                        throw err;
                    }
                    assert.equal(res.statusCode, 200);
                    done();
                });
        });

        /**
         * Test Case: Users - Register - FRD08 valid request - FRD08 should save a new test successfully
         * Purpose: To test that a new test can be saved
         * Expected outcome: Request is successful and test is added
         */
        describe('FRD08 valid request', function () {

            it('FRD08 should save a new test successfully', function (done) {

                this.timeout(20000);

                let testComponents = [];
                const component = {
                    type: 'audio',
                    instruction: '',
                    content: ''
                };
                component.instruction = 'Example: Press record and read the text aloud';
                component.content = 'A quick brown fox jumps over the lazy dog';

                testComponents.push(component);

                console.log(testComponents);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    let doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //ACT: save new test
                        request(server)
                            .post('/tests/saveTest/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({
                                "components": testComponents,
                                "userId": user._id,
                                "testName": new Date().toDateString()
                            })
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }
                                assert.equal(res.statusCode, 200);
                                assert.equal(res.text, '{"success":true,"msg":"Created test"}');
                                done();
                            });
                    });
                });
            });
        });

        /**
         * Test Case: Users - Register - FRD08 invalid request with incorrect userId - FRD08 should return unau
         * Purpose: To test that an unauthorised user cannot add a test for another user
         * Expected outcome: Returns a 401 response and test is not added
         */
        describe('FRD08 invalid request with incorrect userId', function() {

            it('FRD08 should return unauthorised response', function (done) {

                this.timeout(20000);

                console.log("in test");

                var testComponents = [];
                const component = {
                    type: 'audio',
                    instruction: '',
                    content: ''
                };
                component.instruction = 'Example: Press record and read the text aloud';
                component.content = 'A quick brown fox jumps over the lazy dog';

                testComponents.push(component);

                console.log(testComponents);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/tests/saveTest/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({
                                "components": testComponents,
                                "userId": "invalid",
                                "testName": new Date().toDateString()
                            }) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                }

                                assert.equal(res.text, '{"success":false,"msg":"Not authorised to save a test for this user"}');
                                assert.equal(res.status, 401);
                                done();
                            });
                    });
                });

            });

        });

        /**
         * Test Case: Users - Register - FRD08 invalid request with no test name - FRD08 should return a 400 response and not add test
         * Purpose: To test that a test cannot be added if it does not have a name
         * Expected outcome: Returns a 400 response and test is not added
         */
        describe('FRD08 invalid request with no test name', function() {

            it('FRD08 should return a 400 response and not add test', function (done) {

                this.timeout(20000);

                console.log("in test");

                var testComponents = [];
                const component = {
                    type: 'audio',
                    instruction: '',
                    content: ''
                };
                component.instruction = 'Example: Press record and read the text aloud';
                component.content = 'A quick brown fox jumps over the lazy dog';

                testComponents.push(component);

                console.log(testComponents);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/tests/saveTest/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({
                                "components": testComponents,
                                "userId": user._id,
                                //"testName": new Date().toDateString() #NO TEST NAME
                            }) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                }

                                assert.equal(res.text, '{"success":false,"msg":"Failed to save test"}');
                                assert.equal(res.status, 400);
                                done();
                            });
                    });
                });

            });

        });

        /**
         * Test Case: Users - Register - FRD08 invalid request where components have no content - FRD08 should return a 400 response and not add test
         * Purpose: To test that a test cannot be added if one or more components have no contents
         * Expected outcome: Returns a 400 response and test is not added
         */
        describe('FRD08 invalid request where components have no content', function() {

            it('FRD08 should return a 400 response and not add test', function (done) {

                this.timeout(20000);

                var testComponents = [];
                const component = {
                    type: 'audio',
                    instruction: ''
                    //content: '' # NO CONTENT IN COMPONENT
                };
                component.instruction = 'Example: Press record and read the text aloud';
                //component.content = 'A quick brown fox jumps over the lazy dog';

                testComponents.push(component);

                console.log(testComponents);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/tests/saveTest/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({
                                "components": testComponents,
                                "userId": user._id,
                                "testName": new Date().toDateString()
                            }) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                }

                                assert.equal(res.text, '{"success":false,"msg":"Failed to save test"}');
                                assert.equal(res.status, 400);
                                done();
                            });
                    });
                });

            });

        });

        /**
         * Test Case: Users - Register - FRD08 invalid request where components have no instruction - FRD08 should return a 400 response and not add test
         * Purpose: To test that a test cannot be added if one or more components have no instruction
         * Expected outcome: Returns a 400 response and test is not added
         */
        describe('FRD08 invalid request where components have no instruction', function() {

            it('FRD08 should return a 400 response and not add test', function (done) {

                this.timeout(20000);

                var testComponents = [];
                const component = {
                    type: 'audio',
                    //instruction: '',  NO INSTRUCTION IN COMPONENT
                    content: ''
                };
                //component.instruction = 'Example: Press record and read the text aloud';
                component.content = 'A quick brown fox jumps over the lazy dog';

                testComponents.push(component);

                console.log(testComponents);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/tests/saveTest/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({
                                "components": testComponents,
                                "userId": user._id,
                                "testName": new Date().toDateString()
                            }) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                }

                                assert.equal(res.text, '{"success":false,"msg":"Failed to save test"}');
                                assert.equal(res.status, 400);
                                done();
                            });
                    });
                });

            });

        });
    });

    describe('GetUserTests', function() {

        beforeEach(function (done) {

            this.timeout(20000);

            //Add a doctor
            var newUser = {
                firstName: "firstName",
                lastName: "lastName",
                email: "email@email.com",
                password: "password",
                confirm_password: "password"
            };

            request(server)
                .post('/doctors/register/')
                .send(newUser)
                // end handles the response
                .end(function (err, res, next) {
                    if (err) {
                        throw err;
                    }

                    let testComponents = [];
                    const component = {
                        type: 'audio',
                        instruction: '',
                        content: ''
                    };
                    component.instruction = 'Example: Press record and read the text aloud';
                    component.content = 'A quick brown fox jumps over the lazy dog';

                    testComponents.push(component);

                    console.log(testComponents);

                    //Get all doctors
                    Doctor.getAllDoctors(function (err, doctors) {
                        let doctorId = doctors[0].user;

                        //get user
                        User.getUserById(doctors[0].user, function (err, user) {

                            //save test
                            request(server)
                                .post('/tests/saveTest/')
                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                .send({
                                    "components": testComponents,
                                    "userId": user._id,
                                    "testName": new Date().toDateString()
                                }) //NOTE incorrect reference code here
                                // end handles the response
                                .end(function (err, res, next) {
                                    if (err) {
                                        console.log(err);
                                        throw err;
                                    }

                                    console.log(res.body);

                                    done();
                                });

                        });
                    });
                });
        });

        /**
         * Test Case: Users - Register - FRD09 valid request - FRD09 should retrieve tests that the user created
         * Purpose: To test that tests created by users can be retrieved by the user
         * Expected outcome: Request is successful and tests are retreived
         */
        describe('FRD09 valid request', function() {

            it('FRD09 should retrieve tests that the user created', function (done) {

                this.timeout(20000);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    let doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //ACT: should get user tests
                        request(server)
                            .get('/tests/getUserTests/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }

                                console.log(res.body.tests[0] );
                                //unauthorised
                                assert.equal(res.statusCode, 200);
                                assert.equal(res.body.tests[0].components[0].type, 'audio');
                                assert.equal(res.body.tests[0].components[0].instruction, 'Example: Press record and read the text aloud');
                                assert.equal(res.body.tests[0].components[0].content, 'A quick brown fox jumps over the lazy dog');
                                done();
                            });
                    });
                });
            });

        });

        /**
         * Test Case: Users - Register - FRD09 invalid request with invalid JWT token - FRD09 should return a 401 unauthorised response
         * Purpose: To test that tests created by users cannot be retrieved by an unauthorised user
         * Expected outcome: Returns a 401 response and tests are not retrieved
         */
        describe('FRD09 invalid request with invalid JWT token', function() {

            it('FRD09 should return a 401 unauthorised response', function(done) {

                this.timeout(20000);

                Doctor.getAllDoctors(function (err, doctors) {
                    let doctorId = doctors[0].user;

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .get('/tests/getUserTests/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'invalid'))
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }

                                //unauthorised
                                assert.equal(res.statusCode, 401);
                                done();
                            });
                    });
                });

            });
        });
    });

    describe('GetPatientTests', function() {

        beforeEach(function(done) {

            this.timeout(20000);

            //Add a doctor
            var newUser = {
                firstName: "firstName",
                lastName: "lastName",
                email: "email@email.com",
                password: "password",
                confirm_password: "password"
            };

            request(server)
                .post('/doctors/register/')
                .send(newUser)
                // end handles the response
                .end(function (err, res, next) {
                    if (err) {
                        throw err;
                    }

                    let testComponents = [];
                    const component = {
                        type: 'audio',
                        instruction: '',
                        content: ''
                    };
                    component.instruction = 'Example: Press record and read the text aloud';
                    component.content = 'A quick brown fox jumps over the lazy dog';

                    testComponents.push(component);

                    console.log(testComponents);

                    //Get all doctors
                    Doctor.getAllDoctors(function (err, doctors) {
                        let doctorId = doctors[0].user;

                        //get user
                        User.getUserById(doctors[0].user, function (err, user) {

                            //save test
                            request(server)
                                .post('/tests/saveTest/')
                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                .send({
                                    "components": testComponents,
                                    "userId": user._id,
                                    "testName": new Date().toDateString()
                                }) //NOTE incorrect reference code here
                                // end handles the response
                                .end(function (err, res, next) {
                                    if (err) {
                                        console.log(err);
                                        throw err;
                                    }

                                    done();
                                });

                        });
                    });
                });
        });

        describe('FRC07 valid request', function() {

            it('FRC07 should get tests that are assigned to patient', function(done) {

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

                                Test.getAllTests(function(err, tests) {

                                request(server)
                                    .post('/patients/add_patient_test/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                    .send({"patientId": patient._id, "testId": tests[0]._id})
                                    // end handles the response
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        //ACT: Get assigned tests
                                        request(server)
                                            .post('/tests/getPatientTests/')
                                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                            .send({"patientId": patient._id})
                                            // end handles the response
                                            .end(function (err, res) {
                                                if (err) {
                                                    throw err;
                                                }

                                                assert.equal(res.status, 200);
                                                assert.equal(res.body.tests[0]._id, tests[0]._id)
                                                done();
                                            });

                                    });

                                });
                            }
                        });
                    }
                });

            });
        });

        describe('FRC07 invalid request with wrong patientId', function() {

            it('FRC07 should error and not return any tests', function(done) {

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

                                Test.getAllTests(function(err, tests) {

                                    request(server)
                                        .post('/patients/add_patient_test/')
                                        .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                        .send({"patientId": patient._id, "testId": tests[0]._id})
                                        // end handles the response
                                        .end(function (err, res) {
                                            if (err) {
                                                throw err;
                                            }

                                            //ACT: Get assigned tests
                                            request(server)
                                                .post('/tests/getPatientTests/')
                                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                                .send({"patientId": "59f6ba5b66c1a047a10c5184"}) //INVALID PATIENT ID
                                                // end handles the response
                                                .end(function (err, res) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    assert.equal(res.text, '{"success":false,"msgs":"Failed to find patient with id: 59f6ba5b66c1a047a10c5184"}');
                                                    assert.equal(res.status, 400);
                                                    done();
                                                });

                                        });

                                });
                            }
                        });
                    }
                });

            });
        })

        describe('FRC07 invalid request with invalid JWT token', function() {

            it('FRC07 should error and not return any tests', function(done) {

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

                                Test.getAllTests(function(err, tests) {

                                    request(server)
                                        .post('/patients/add_patient_test/')
                                        .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                        .send({"patientId": patient._id, "testId": tests[0]._id})
                                        // end handles the response
                                        .end(function (err, res) {
                                            if (err) {
                                                throw err;
                                            }

                                            //ACT: Get assigned tests
                                            request(server)
                                                .post('/tests/getPatientTests/')
                                                .set('Authorization', 'JWT ' + jwt.sign(user, 'invalid'))
                                                .send({"patientId": patient._id}) //INVALID PATIENT ID
                                                // end handles the response
                                                .end(function (err, res) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    assert.equal(res.text, "Unauthorized");
                                                    assert.equal(res.status, 401);
                                                    done();
                                                });

                                        });

                                });
                            }
                        });
                    }
                });

            });
        })
    });

    //NOTE: "FRC08 Submit tests" and speech to text transcription will be covered in exploratory testing
});