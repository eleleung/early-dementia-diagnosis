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


//For adding a new doctor to the app and authenticating that doctor
describe('Doctors', function () {

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

        /**
         * Test Case: Doctors - Register - FRD02 invalid request with incorrect return password - FRD02 should return a 200 response with no error message
         * Purpose: Should not throw an error since this validation is done on the front end
         */
        describe("FRD02 invalid request with incorrect confirm password", function () {

            it('FRD02 should return a 200 response with no error message', function (done) {

                this.timeout(20000);

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
                        assert.equal(res.statusCode, 200);
                        done();
                    });
            });
        })
    });

    describe("Authenticate", function () {

        beforeEach(function (done) {

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
        describe("FED03B request with SQL injection attack", function () {

            it("should sanitise input and prevent SQL injection attack", function (done) {

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
                    email: "doctor@email.com",
                    password: "password",
                    confirm_password: "password"
                };

                request(server)
                    .post('/doctors/register/')
                    .send(newUser)
                    // end handles the response
                    .end(function (err, res) {
                        if (err) {
                            console.log('error');
                            throw err;
                        }

                        console.log(res.body);
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
                                throw err;
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

                                            //ACT: should assign patient to doctor
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

                                                    assert.equal(res.text, '{"success":true,"msg":"Successfully linked patient to doctor"}');
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
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }

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
                                    .end(function (err) {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        }

                                        Patient.getAllPatients(function (err, patients) {

                                            var patientId = patients[0]._id;

                                            //ACT: should NOT assign patient to doctor
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

                                                    assert.equal(res.text, '{"success":false,"msg":"Failed to link patient to doctor"}');
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
        describe("FRD05 incorrect patient id", function () {

            it("FRD05 should not assign patient to doctor", function (done) {
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
                                    .end(function (err) {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        }

                                            //ACT: should NOT assign patient to doctor
                                            request(server)
                                                .post('/doctors/assign-doctor/')
                                                .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                                                .send({
                                                    "patientId": "incorrectpatientid",
                                                    "referenceCode": doctorRefCode
                                                }) //NOTE: incorrect patientId
                                                // end handles the response
                                                .end(function (err, res, next) {
                                                    if (err) {
                                                        console.log(err);
                                                        throw err;
                                                    }

                                                    assert.equal(res.text, '{"success":false,"msg":"Failed to link patient to doctor"}');
                                                    done();
                                                });
                                    });

                            }
                        });
                    });
            });
        });
    });

    describe("GetAllDoctorPatients", function () {

        beforeEach(function (done) {

            //add a patient and assign them to a doctor

            this.timeout(30000);

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
                                                done();
                                            });
                                    });
                                });

                        }
                    });
                });
        });

        /**
         * Test Case: Doctors  - GetAllDoctorPatients - FRD07 valid request - FRD07 should get all patients assigned to the doctor
         * Purpose: To test that doctors can view their patients
         * Expected outcome: Successful (200) response and patient object is returned correctly
         */
        describe("FRD07 valid request", function () {

            it("FRD07 should get all patients assigned to the doctor", function (done) {
                this.timeout(20000);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;
                    console.log(doctorId);

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/doctors/get-all-doctor-patients/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({"userId": doctorId}) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }

                                console.log();

                                assert.equal(res.statusCode, 200);
                                assert.equal(res.body.patients.user.patients[0].firstName, "patientFirstName");
                                assert.equal(res.body.patients.user.patients[0].lastName, "patientLastName");
                                done();
                            });

                    });
                });

            });

        });

        /**
         * Test Case: Doctors  - GetAllDoctorPatients - FRD07 request with an invalid doctor id - FRD07 should return an error with a 400 statusCode
         * Purpose: To test that no patients are returned when an invalid doctorId is used
         * Expected outcome: Unsuccessful (400) response with no patients returned
         */
        describe("FRD07 request with an invalid doctor id", function () {

            it("FRD07 should return an error with a 400 statusCode", function (done) {

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;
                    console.log(doctorId);

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/doctors/get-all-doctor-patients/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send({"userId": "invalid"}) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }

                                assert.equal(res.statusCode, 400);
                                done();
                            });

                    });
                });
            });
        });

        /**
         * Test Case: Doctors - GetAllDoctorPatients - FRD07 request with an invalid JWT token - FRD07 should return a 401 unauthorised response
         * Purpose: To test that an unauthorised user cannot access a doctor's patient list
         * Expected outcome: Unauthorised (401) response with no patients returned
         */
        describe("FRD07 request with an invalid JWT token", function () {

            it("FRD07 should return a 401 unauthorised response", function (done) {
                this.timeout(20000);

                //Get all doctors
                Doctor.getAllDoctors(function (err, doctors) {
                    var doctorId = doctors[0].user;
                    console.log(doctorId);

                    //get user
                    User.getUserById(doctors[0].user, function (err, user) {

                        //should NOT assign patient to doctor
                        request(server)
                            .post('/doctors/get-all-doctor-patients/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'invalid'))
                            .send({"userId": doctorId}) //NOTE incorrect reference code here
                            // end handles the response
                            .end(function (err, res, next) {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }

                                assert.equal(res.statusCode, 401);
                                done();
                            });
                    });
                });
            });

        });
    });

    describe("Profile", function () {

        /**
         * Test Case: Users - Profile - FRD03 get doctor profile - FRD03 should get correct doctor profile successfully
         * Purpose: To test that a doctor profile can be retrieved
         * Expected outcome: Correct doctor profile is returned
         */
        describe("FRD03 get user profile", function () {

            it("FRD03 should get correct doctor profile successfully", function (done) {

                this.timeout(20000);

                let newUser = new User({
                    firstName: "firstName",
                    lastName: "lastName",
                    email: "doctor@email.com",
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
                            .get('/doctors/profile/')
                            .set('Authorization', 'JWT ' + jwt.sign(user, 'yoursecret'))
                            .send(user)
                            // end handles the response
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                console.log(res.text);
                                assert.equal(res.statusCode, 200);
                                assert.equal(res.body.doctor.firstName, "firstName");
                                assert.equal(res.body.doctor.lastName, "lastName");
                                assert.equal(res.body.doctor.email, "doctor@email.com");
                                done();
                            });
                    }
                });

            });

        });

        /**
         * Test Case: Users - Profile - FRD03 get doctor profile invalid JWT token - FRD03 should return an unauthorised response
         * Purpose: To test that a doctor profile cannot be returned if JWT token is incorrect
         * Expected outcome: Returns a 401, unauthorised response
         */
        describe("FRD03 get user profile invalid JWT token", function () {

            it("FRD03 should return an unauthorised response", function (done) {

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
                            .get('/doctors/profile/')
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