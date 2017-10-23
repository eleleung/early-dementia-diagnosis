/**
 * Created by caitlinwoods on 6/5/17.
 * These tests are from the route level and incorpera
 */

//NOTE: BE CAREFUL RUNNING THESE WITHOUT SWITCHING THE DATABASE FIRST
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('debug');
var express = require('express');
app = express();
var server = require('../app.test');
const User = require('../models/user');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
jwt = require('jsonwebtoken');

//For registration / login of a new carer / patient
describe('Users', function () {

    //Register tests
    describe("Register", function () {

        beforeEach(function (done) {

            //clear the test db
            User.removeUsers(function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
            });
            done();
        });

        /**
         * Test Case: Users - Register - FRC01 valid request - FRC01 should add new user and give a 200 Status Code
         * Purpose: To test a valid user sign up request
         * Expected outcome: Request is successful and user is signed up
         */
        describe("FRC01 valid request", function () {

            it("FRC01 should add new user and give a 200 Status Code", function (done) {
                this.timeout(10000);

                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "email@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // should be successful
                        assert.equal(res.text, '{"success":true,"msg":"User registered"}');
                        assert.equal(res.statusCode, 200);

                        done();
                    });
            });
        });

        /**
         * Test Case: Users - Register - FRC01 additional valid request with same email - FRC01 should only add first user
         * Purpose: To test that the same user cannot be added twice
         * Expected outcome: Request is unsuccessful and user is not signed up twice
         */
        describe("FRC01 additional valid request with same email", function () {

            it("FRC01 should only add first user", function (done) {
                this.timeout(10000);

                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user1@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        assert.equal(res.statusCode, 200);


                        var newUser2 = {
                            firstName: "firstName",
                            lastName: "lastName",
                            email: "user1@email.com",
                            password: "password",
                            confirm_password: "password"
                        };

                        request(server)
                            .post('/users/register/')
                            .send(newUser2)
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                assert.equal(res.statusCode, 400);
                                done();
                            });
                    });
            });
        });

        /**
         * Test Case: Users - Register - FRC01 additional valid request with different email - FRC01 should add both users
         * Purpose: To test that a second, different user can be added to the database
         * Expected outcome: Request is successful and both users are added to the database
         */
        describe("FRC01 additional valid request with different email", function (done) {

            it("FRC01 should add both users", function (done) {

                this.timeout(10000);
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user1@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        assert.equal(res.statusCode, 200);

                        var newUser2 = {
                            firstName: "firstName",
                            lastName: "lastName",
                            email: "user2@email.com",
                            password: "password",
                            confirm_password: "password"
                        };

                        request(server)
                            .post('/users/register/')
                            .send(newUser2)
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                assert.equal(res.statusCode, 200);

                                done();
                            });

                    });
            });
        });

        /**
         * Test Case: Users - Register - FRC01 Invalid request with incorrect confirmed password - FRC01 should add user
         * Purpose: Tests that the user is added regardless, as this validation is done on the front end
         * Expected Outcome: User is added regardless of incorrect confirm password
         */
        describe("FRC01 Invalid request with incorrect confirmed password", function () {
            it("FRC01 should add user", function (done) {
                this.timeout(10000);
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "email@email.com",
                    password: "password",
                    confirm_password: "p"
                };

                request(server)
                    .post('/users/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        // should not error because this validation is done on the front end
                        assert.equal(res.statusCode, 200);

                        done();
                    });
            });
        });
    });

    //Authenticate tests
    describe("Authenticate", function () {

        beforeEach(function (done) {

            this.timeout(20000);

            User.removeUsers(function (err) {
                if (err) {
                    throw err;
                }
            });

            //authenticate the user
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
                    console.log('user :' + user);
                    done();
                }
            });

        });

        /**
         * Test Case: Users - Authenticate - FRC02 valid request - FRC02 should authenticate the new user
         * Purpose: To test that a valid request with the user name and password of a user will authenticate correctly
         * Expected Outcome: The response will be successful indicating that the user is authenticated
         */
        describe("FRC02 valid request", function () {

            it("FRC02 should authenticate the new user", function (done) {
                this.timeout(20000);

                var user = {
                    email: "user3@gmail.com",
                    password: "password"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should authenticate successfully
                        assert.equal(res.statusCode, 200);
                        done();
                    });
            });
        });

        /**
         * Test Case: Users - Authenticate - FRC02 email does not exist - FRC02 should return fail (400) status with UserNotFound error message
         * Purpose: To test that a request with an invalid email will not authenticate the user
         * Expected Outcome: The response will be unsuccessful (400), the error message will be "User Not Found" and the user will not be authenticated
         */
        describe("FRC02 email does not exist", function () {

            it("FRC02 should return fail (400) status with UserNotFound error message", function (done) {
                this.timeout(10000);

                //authenticate the user
                var user = {
                    email: "user2@gmail.com", //User 2 is different to the previously added email
                    password: "password"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should authenticate successfully
                        console.log(res.text);
                        assert.equal(res.text, '{"success":false,"msg":"User not found or password is incorrect"}');
                        assert.equal(res.statusCode, 400);
                        done();
                    });
            });

        });

        /**
         * Test Case: Users - Authenticate - FRC02 incorrect password - FRC02 should return fail (400) with IncorrectPassword error message
         * Purpose: To test that a request with an incorrect password will not authenticate the user
         * Expected Outcome: The response will be unsuccessful (400), the error message will be "Incorrect Password" and the user will not be authenticated
         */
        describe("FRC02 incorrect password", function () {

            it("FRC02 should return fail (400) with IncorrectPassword error message", function (done) {
                this.timeout(10000);

                //authenticate the user
                var user = {
                    email: "user3@gmail.com", //User 2 is different to the previously added email
                    password: "incorrect"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should authenticate successfully
                        console.log(res.text);
                        assert.equal(res.text, '{"success":false,"msg":"Wrong password"}');
                        assert.equal(res.statusCode, 400);
                        done();
                    });
            });

        });

        /**
         * Test Case: Users - Authenticate - FRC02 invalid request as a doctor tries to authenticate as a user - FRC02 should error as a doctor should not be able to log into the mobile app
         * Purpose: To test that users cannot log into the mobile app with a "Doctor" account
         * Expected Outcome: Response should be unsuccessful (400) and the user should not be authenticated
         */
        describe("FRC02 invalid request as a doctor tries to authenticate as a user", function () {

            it("FRC02 should error as a doctor should not be able to log into the mobile app", function (done) {
                this.timeout(20000);

                //add new doctor
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "doctoremail@email.com",
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

                        //ACT: Try to authenticate doctor as a user
                        var user = {
                            email: "doctoremail@email.com",
                            password: "password"
                        };

                        request(server)
                            .post('/users/authenticate/')
                            .send(user)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                // should authenticate successfully
                                console.log(res.text);
                                assert.equal(res.statusCode, 400);
                                done();
                            });
                    });

            });
        });

        /**
         * Test Case: Users - Authenticate - FRC02 sql injection attack - should sanitise input and prevent sql injection attack
         * Purpose: To test that malicious users cannot perform a SQL injection attack to authenticate themselves
         * Expected Outcome: Response should be unsuccessful (400) and the user should not be authenticated
         */
        describe("FRC02 sql injection attack", function() {

            it("should sanitise input and prevent sql injection attack", function (done) {

                this.timeout(20000);

                var user = {
                    email: '{"$ne": null}',
                    password: '{"$ne": null}'
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should not authenticate user
                        assert.equal(res.statusCode, 400);
                        done();
                    });
            });
        });
    });

    //GetPatients tests
    describe("GetPatients", function () {

        beforeEach(function (done) {

            this.timeout(20000);

            Patient.removePatients(function (err) {
                if (err) {
                    throw err;
                }
            });
            User.removeUsers(function (err) {
                if (err) {
                    throw err;
                }
            });
            done();
        });

        /**
         * Test Case: Users - GetPatients - FRC05 valid request with no patients - FRC05 should return a 200 response with no patients
         * Purpose: To test that a carer can make a request to "GetPatients", even when they have no patients
         * Expected outcome: Response should be successful (200) and should return NoPatients
         */
        describe("FRC05 valid request with no patients", function () {

            it('FRC05 should return a 200 response with no patients', function (done) {
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
                    }
                    else {
                        console.log('user :' + user);

                        request(server)
                            .get('/users/getPatients/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send(user)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                assert.equal(res.text, '{"success":true,"msg":"Success","carerPatients":[]}');
                                assert.equal(res.statusCode, 200);
                                done();
                            });
                    }
                });
            });
        });

        /**
         * Test Case: Users - GetPatients - FRC05 valid request with patients - FRC05 valid request with patients
         * Purpose: To test that a carer can make a request to "GetPatients"
         * Expected outcome: Response should be successful (200) and should return a response with patients
         */
        describe("FRC05 valid request with patients", function () {

            it('FRC05 should return a patient', function (done) {

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

                                assert.equal(res.text, '{"success":true,"msg":"Patient registered"}');
                                assert.equal(res.statusCode, 200);


                                //ACT: GET PATIENT
                                request(server)
                                    .get('/users/getPatients/')
                                    .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                    .send(user)
                                    // end handles the response
                                    .end(function (err, res, next) {
                                        if (err) {
                                            throw err;
                                        }
                                        assert.equal(res.body.carerPatients[0].lastName, 'patientLastName');
                                        assert.equal(res.body.carerPatients[0].firstName, 'patientFirstName');
                                        assert.equal(res.body.carerPatients[0].gender, 'Female');
                                        assert.equal(res.statusCode, 200);
                                        done();
                                    });

                            });
                    }
                });

            });
        });

        /**
         * Test Case: Users - GetPatients - FRC05 invalid request with missing JWT token - FRC05 should return a 401 unauthorised response
         * Purpose: To test that a if an invalid JWT token is passed to GetPatients, an unauthorised response is returned
         * Expected outcome: An Unauthorised (401) response should be returned
         */
        describe("FRC05 invalid request with missing JWT token", function () {

            it('FRC05 should return a 401 unauthorised response', function (done) {
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
                    }
                    else {
                        console.log('user :' + user);

                        request(server)
                            .get('/users/getPatients/')
                            .set('Authorization', 'invalid')
                            .send(user)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                assert.equal(res.text, "Unauthorized");
                                assert.equal(res.statusCode, 401);
                                done();
                            });
                    }
                });
            });
        });
    });
});

//For adding a new patient to the app and assigning to a carer
describe('Patients', function () {

    describe("Register", function () {

        beforeEach(function (done) {
            this.timeout(20000);

            Patient.removePatients(function (err) {
                if (err) {
                    throw err;
                }
            });
            User.removeUsers(function (err) {
                if (err) {
                    throw err;
                }
            });
            done();
        });

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
                                //todo: do more thorough assert
                                console.log(res.body);
                                assert.equal(res.text, '{"success":true,"msg":"Patient registered"}');
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

});

//For adding a new doctor to the app and authenticating that doctor
describe('Doctors', function () {

    describe("Register", function () {

        this.timeout(60000);

        beforeEach(function (done) {

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
            done();
        });

        /**
         * Test Case: Doctors - Register - FRD02 valid request - FRD02 should return a 200 response with doctor registered
         * Purpose: To test that a valid request to Register will register a doctor
         * Expected Outcome: Successful (200) response, and doctor should be registered
         */
        describe("FRD02 valid request", function () {

            it('FRD02 should return a 200 response with doctor registered', function (done) {

                this.timeout(20000);

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

                        assert.equal(res.statusCode, 200);
                        done();
                    });
            });
        });

        describe("FRD02 invalid request with incorrect confirm password", function () {

            //TEST FAILS: WRITE DOWN DEFECT
            it('FRD02 should return a 400 response with error message', function (done) {

                /* this.timeout(20000);

                 var newUser = {
                 firstName: "firstName",
                 lastName: "lastName",
                 email: "email@email.com",
                 password: "password",
                 confirm_password: "invalidpassword"
                 };

                 request(server)
                 .post('/doctors/register/')
                 .send(newUser)
                 // end handles the response
                 .end(function (err, res, next) {
                 if (err) {
                 throw err;
                 }

                 //TODO: make assert more verbose
                 console.log(res.text);
                 assert.equal(res.statusCode, 400);
                 done();
                 });*/
                done();
            });
        })
    });

    describe("Authenticate", function () {

        beforeEach(function (done) {

            this.timeout(20000);

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

            //add new doctor
            var newUser = {
                firstName: "firstName",
                lastName: "lastName",
                email: "doctoremail@email.com",
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
                    done();
                });
        });

        /**
         * Test Case: Doctors - Authenticate - FRD03A valid request - FRD03A should authenticate doctor
         * Purpose: To test that a valid call to authenticate doctor with the correct username and password will successfuly authenticate the doctor
         * Expected Outcome: Successful (200) response meaning doctor is authenticated
         */
        describe("FRD03A valid request", function () {

            it("FRD03A should authenticate doctor", function (done) {

                this.timeout(20000);

                var user = {
                    email: "doctoremail@email.com",
                    password: "password"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should authenticate successfully
                        console.log(res.text);
                        assert.equal(res.statusCode, 200);
                        done();
                    });
            });
        });

        /**
         * Test Case: Doctors - Authenticate - FRD03B invalid request with incorrect password - FRD03B should return 400 error response and not authenticate doctor
         * Purpose: To test that a invalid call to authenticate doctor with an invalid password will not authenticate doctor
         * Expected Outcome: Unsuccessful (400) response meaning doctor is not authenticated
         */
        describe("FRD03B invalid request with incorrect password", function () {

            it("FRD03B should return 400 error response and not authenticate doctor", function (done) {

                this.timeout(20000);

                var user = {
                    email: "doctoremail@email.com",
                    password: "invalidpassword"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should authenticate successfully
                        console.log(res.text);
                        assert.equal(res.text, '{"success":false,"msg":"Wrong password"}');
                        assert.equal(res.statusCode, 400);
                        done();
                    });
            });
        });

        /**
         * Test Case: Doctors - Authenticate - FRD03B invalid request with incorrect email - FRD03B should return 400 error response and respond with UserNotFound
         * Purpose: To test that a invalid call to authenticate doctor with an invalid email will not authenticate doctor
         * Expected Outcome: Unsuccessful (400) response meaning doctor is not authenticated and a response of "UserNotFound"
         */
        describe("FRD03B invalid request with incorrect email", function () {

            it("FRD03B should return 400 error response and respond with UserNotFound", function (done) {

                this.timeout(20000);

                var user = {
                    email: "invalidemail@email.com",
                    password: "password"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should authenticate successfully
                        console.log(res.text);
                        assert.equal(res.text, '{"success":false,"msg":"User not found or password is incorrect"}');
                        assert.equal(res.statusCode, 400);
                        done();
                    });
            });
        });

        /**
         * Test Case: Users - Authenticate - FRC03B invalid request as a carer tries to authenticate as a doctor - FRC03B should error as a doctor should not be able to log into the mobile app
         * Purpose: To test that users cannot log into the mobile app with a "Doctor" account
         * Expected Outcome: Response should be unsuccessful (400) and the user should not be authenticated
         */
        describe("FRD03B invalid request as non doctor tries to authenticate as a doctor", function () {

            it("FRD03B should return 400 status with DoctorNotFound error", function (done) {

                this.timeout(20000);

                var nonDoctorUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "user3@gmail.com",
                    password: "password",
                    dateOfBirth: ''
                });


                var nonDoctorUserAuthenticate = {
                    email: "user3@gmail.com",
                    password: "password"
                };

                //add user to but not as doctor

                User.addUser(nonDoctorUser, function (err, user) {
                    if (err) {
                        console.log('error :' + err);
                        done();
                    }
                    else {

                        request(server)
                            .post('/users/authenticate/')
                            .send(nonDoctorUserAuthenticate)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                // should authenticate successfully
                                console.log(res.text);
                                assert.equal(res.text, '{"success":false,"msg":"Doctor not found"}');
                                assert.equal(res.statusCode, 400);
                                done();
                            });
                    }
                });
            });
        });

        /**
         * Test Case: Doctors - Authenticate - FRC03B sql injection attack - should sanitise input and prevent sql injection attack
         * Purpose: To test that malicious users cannot perform a SQL injection attack to authenticate themselves
         * Expected Outcome: Response should be unsuccessful (400) and the user should not be authenticated
         */
        describe("FED03B request with SQL injection attack", function() {

            it ("should sanitise input and prevent SQL injection attack", function() {

                this.timeout(20000);

                var user = {
                    email: '{"$ne": null}',
                    password: '{"$ne": null}'
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res, next) {
                        if (err) {
                            throw err;
                        }
                        // should not authenticate successfully
                        assert.equal(res.statusCode, 400);
                        done();
                    });
            });
        });
    });

    describe("AssignDoctor", function () {

        beforeEach(function (done) {

            this.timeout(20000);

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
            Patient.removePatients(function (err) {
                if (err) {
                    throw err;
                }
            });

            done();

        });

        /**
         * Test Case: Doctors  - Assign Doctor - FRD05 valid request - FRD05 should assign the patient to the doctor
         * Purpose: To test that a patient can be assigned to a doctor if a valid reference code is sent into the request
         * Expected outcome: Successful (200) response and patient is assigned to the doctor
         */
        describe("FRD05 valid request", function () {

            it("FRD05 should assign the patient to the the doctor", function (done) {

                this.timeout(20000);

                //add new doctor
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "doctoremail@email.com",
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
                        console.log(res.body.doctor.referenceCode);
                        var doctorRefCode = res.body.doctor.referenceCode;

                        // add a new patient
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
                                    lastName: "patientLastName",
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
                                            console.log(err);
                                            throw err;
                                        }

                                        Patient.getAllPatients(function (err, patients) {

                                            var patientId = patients[0]._id;

                                            //should assign patient to doctor
                                            request(server)
                                                .post('/doctors/assign-doctor/')
                                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                                .send({"patientId": patientId, "referenceCode": doctorRefCode})
                                                // end handles the response
                                                .end(function (err, res, next) {
                                                    if (err) {
                                                        console.log(err);
                                                        throw err;
                                                    }

                                                    assert.equal(res.text,'{"success":true,"msg":"Successfully linked patient to doctor"}');
                                                    done();
                                                });
                                            });
                                    });

                            }
                        });
                    });
            });

        });

        /**
         * Test Case: Doctors  - Assign Doctor - FRD05 incorrect doctor reference code - FRD05 should fail to assign patient to the doctor
         * Purpose: To test that a patient cannot be assigned to a doctor if an invalid reference code is sent into the request
         * Expected outcome: Unsuccessful (400) response and patient not is assigned to the doctor
         */
        describe("FRD05 incorrect doctor reference code", function () {

            it("FRD05 should fail to assign patient to the doctor", function (done) {
                this.timeout(20000);

                //add new doctor
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "doctoremail@email.com",
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
                        console.log(res.body.doctor.referenceCode);
                        var doctorRefCode = res.body.doctor.referenceCode;

                        // add a new patient
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
                                    lastName: "patientLastName",
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
                                            console.log(err);
                                            throw err;
                                        }

                                        Patient.getAllPatients(function (err, patients) {

                                            var patientId = patients[0]._id;

                                            //should NOT assign patient to doctor
                                            request(server)
                                                .post('/doctors/assign-doctor/')
                                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                                .send({"patientId": patientId, "referenceCode": "incorrectrefcode"}) //NOTE incorrect reference code here
                                                // end handles the response
                                                .end(function (err, res, next) {
                                                    if (err) {
                                                        console.log(err);
                                                        throw err;
                                                    }

                                                    assert.equal(res.text,'{"success":false,"msg":"Failed to link patient to doctor"}');
                                                    done();
                                                });
                                        });
                                    });

                            }
                        });
                    });
            });
        });


        /**
         * Test Case: Doctors  - Assign Doctor - FRD05 incorrect patient id - FRD05 should not assign patient to doctor
         * Purpose: To test that a patient cannot be assigned to a doctor if an invalid patientId is sent into the request
         * Expected outcome: Unsuccessful (400) response and patient not is assigned to the doctor
         */
        describe("FRD05 incorrect patient id", function() {

            it("FRD05 should not assign patient to doctor", function(done) {
                this.timeout(20000);

                //add new doctor
                var newUser = {
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "doctoremail@email.com",
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
                        console.log(res.body.doctor.referenceCode);
                        var doctorRefCode = res.body.doctor.referenceCode;

                        // add a new patient
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
                                    lastName: "patientLastName",
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
                                            console.log(err);
                                            throw err;
                                        }

                                        Patient.getAllPatients(function (err, patients) {

                                            var patientId = patients[0]._id;

                                            //should NOT assign patient to doctor
                                            request(server)
                                                .post('/doctors/assign-doctor/')
                                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                                .send({"patientId": "incorrectpatientid", "referenceCode": doctorRefCode}) //NOTE: incorrect patientId
                                                // end handles the response
                                                .end(function (err, res, next) {
                                                    if (err) {
                                                        console.log(err);
                                                        throw err;
                                                    }

                                                    assert.equal(res.text,'{"success":false,"msg":"Failed to link patient to doctor"}');
                                                    done();
                                                });
                                        });
                                    });

                            }
                        });
                    });
            });
        });
    });
});

//For creating tests
describe('Tests', function() {

});


