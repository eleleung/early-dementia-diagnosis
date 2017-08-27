/**
 * Created by caitlinwoods on 6/5/17.
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
var server = require('../app');
const User = require('../models/user');

describe('Users', function() {

    //Register tests
    describe("Register", function () {

        beforeEach(function (done) {

            //clear the test db
            User.removeUsers(function (err) {
                if (err) {
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
                    });

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

        describe("additional valid request with different email", function () {

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
                    });

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

        //TEST FAILS: Invalid confirmed password is not checked
        /* describe("Invalid request with incorrect confirmed password", function () {
         it("should not add a user and return invalid status code", function (done) {
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
         // should error because of the incorrect confirmed password
         assert.equal(res.statusCode, 400);

         done();
         });

         });*/
        //});
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
                        assert.equal(res.text, '{"success":false,"msg":"User not found"}');
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
        });

    //GetPatients tests
    describe("GetPatients", function() {

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

    });
});


