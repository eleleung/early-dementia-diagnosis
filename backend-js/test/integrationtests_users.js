/**
 * Created by caitlinwoods on 29/10/17.
 */
let should = require('should');
let assert = require('assert');
let mongoose = require('mongoose');
let winston = require('winston');
let express = require('express');
app = express();
let server = require('../app.test');
jwt = require('jsonwebtoken');
const User = require('../models/user');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Test = require('../models/test');
let request = require('supertest');
let config = require('debug');


//For registration / login of a new carer / patient
describe('Users', function () {

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

    //Register tests
    describe("Register", function () {

        /**
         * Test Case: Users - Register - FRC01 valid request - FRC01 should add new user and give a 200 Status Code
         * Purpose: To test a valid user sign up request
         * Expected outcome: Request is successful and user is signed up
         */
        describe("FRC01 valid request", function () {

            it("FRC01 should add new user and give a 200 Status Code", function (done) {
                this.timeout(10000);

                let newUser = {
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

                let newUser = {
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


                        let newUser2 = {
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
                let newUser = {
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

                        let newUser2 = {
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
                let newUser = {
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

            let newUser = new User({
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

                let user = {
                    email: "user3@gmail.com",
                    password: "password"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res) {
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
                let user = {
                    email: "user2@gmail.com", //User 2 is different to the previously added email
                    password: "password"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res) {
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
                let user = {
                    email: "user3@gmail.com", //User 2 is different to the previously added email
                    password: "incorrect"
                };

                request(server)
                    .post('/users/authenticate/')
                    .send(user)
                    // end handles the response
                    .end(function (err, res) {
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
                let newUser = {
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
                    .end(function (err) {
                        if (err) {
                            throw err;
                        }

                        //ACT: Try to authenticate doctor as a user
                        let user = {
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
                                assert.equal(res.statusCode, 400); //should error
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

                // imitate a SQL injection attack
                let user = {
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

        /**
         * Test Case: Users - GetPatients - FRC05 valid request with no patients - FRC05 should return a 200 response with no patients
         * Purpose: To test that a carer can make a request to "GetPatients", even when they have no patients
         * Expected outcome: Response should be successful (200) and should return NoPatients
         */
        describe("FRC05 valid request with no patients", function () {

            it('FRC05 should return a 200 response with no patients', function (done) {
                this.timeout(20000);

                let newUser = new User({
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

                let newUser = new User({
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
                        let newPatient = new Patient({
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
                            .end(function (err) {
                                if (err) {
                                    throw err;
                                }

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

                let newUser = new User({
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
                        request(server)
                            .get('/users/getPatients/')
                            .set('Authorization', 'invalid')  // invalid secret
                            .send(user)
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                assert.equal(res.text, "Unauthorized");
                                assert.equal(res.statusCode, 401); // unauthorised status code
                                done();
                            });
                    }
                });
            });
        });
    });

    //Profile tests
    describe("Profile", function() {

        /**
         * Test Case: Users - Profile - FRC02 get user profile - FRC02 should get correct user profile successfully
         * Purpose: To test that a user profile can be retrieved
         * Expected outcome: Correct user profile is returned
         */
        describe("FRC02 get user profile", function() {

            it("FRC02 should get correct user profile successfully", function(done) {
                this.timeout(20000)

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
                        console.log('user :' + user);

                        request(server)
                            .get('/users/profile/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send(user)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                console.log(res.text);
                                assert.equal(res.statusCode, 200);
                                assert.equal(res.body.user.firstName, "firstName");
                                assert.equal(res.body.user.lastName, "lastName");
                                assert.equal(res.body.user.email, "email@email.com");
                                done();
                            });
                    }
                });

            });

        });

        /**
         * Test Case: Users - Profile - FRC02 get user profile invalid JWT token - FRC02 should return an unauthorised response
         * Purpose: To test that a user profile cannot be returned if JWT token is incorrect
         * Expected outcome: Returns a 401, unauthorised response
         */
        describe("FRC02 get user profile invalid JWT token", function() {

            it("FRC02 should return an unauthorised response", function(done) {

                this.timeout(20000);

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
                        console.log('user :' + user);

                        request(server)
                            .get('/users/profile/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'invalid'))
                            .send(user)
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    throw err;
                                }
                                assert.equal(res.statusCode, 401);
                                done();
                            });
                    }
                });

            });

        });

    });
});
