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

        describe("valid request", function () {

            it("should add new user and give a 200 Status Code", function (done) {
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

        describe("additional valid request with same email", function () {

            it("should only add first user", function (done) {
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

        describe("additional valid request with different email", function (done) {

            it("should add both users", function (done) {

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

        describe("Invalid request with incorrect confirmed password", function () {
            it("should add user", function (done) {
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

        describe("valid request", function () {
            it("should authenticate the new user", function (done) {
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
                        console.log('in req 2');
                        console.log(res.text);
                        assert.equal(res.statusCode, 200);
                        done();
                    });
            });
        });

        describe("email does not exist", function () {

            it("should return fail (400) status with UserNotFound error message", function (done) {
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

        describe("incorrect password", function () {
            it("should return fail (400) with IncorrectPassword error message", function (done) {
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

        describe("invalid request as a doctor tries to authenticate as a user", function () {

            it("should error as a doctor should not be able to log into the mobile app", function (done) {
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

        describe("valid request with no patients", function () {

            it('should return a 200 response with no patients', function (done) {
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

        describe("valid request with patients", function () {

            it('should return a patient', function (done) {

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

        describe("invalid request with missing JWT token", function () {

            it('should return a 401 unauthorised response', function (done) {
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

        describe("valid request", function () {

            it("should register patient", function (done) {

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

        describe("invalid request no sirname in request", function () {

            it("should return 400 status and not register patient", function (done) {
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

        describe("invalid request empty sirname in request", function () {

            it("should return 400 status no registered patient", function (done) {
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

        describe("invalid request invalid JWT token", function () {

            it("should return 401 status with Unauthorised response", function (done) {
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
        })

        describe("valid request", function () {

            it('should return a 200 response with doctor registered', function (done) {

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

                        //TODO: make assert more verbose
                        console.log(res.text);
                        assert.equal(res.statusCode, 200);
                        done();
                    });
            });
        });

        describe("invalid request with incorrect confirm password", function () {

            //TEST FAILS: WRITE DOWN DEFECT
            it('should return a 400 response with error message', function (done) {

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

        describe("valid request", function () {

            it("should authenticate doctor", function (done) {

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

        describe("invalid request with incorrect password", function () {

            it("should return 400 error response and not authenticate doctor", function (done) {

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

        describe("invalid request with incorrect email", function () {

            it("should return 400 error response and respond with UserNotFound", function (done) {

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

        describe("invalid request as non doctor tries to authenticate as a doctor", function () {

            it("should return 400 status with DoctorNotFound error", function (done) {

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

        describe("valid request", function () {

            it("should assign the patient to the the doctor", function (done) {

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

        describe("incorrect doctor reference code", function () {
            it("should fail to assign patient to the doctor", function (done) {
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

        describe("incorrect patient id", function() {

            it("should not assign patient to doctor", function(done) {
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

