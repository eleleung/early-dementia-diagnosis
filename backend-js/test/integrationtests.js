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
const Test = require('../models/test');
jwt = require('jsonwebtoken');

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

//To run all tests
describe('Run all tests', function () {

    importTest("users", './integrationtests_users');
    importTest("patients", './integrationtests_patients');
    importTest("doctors", './integrationtests_doctors');
    importTest("tests", './integrationtests_tests');
    importTest("testresults", './integrationtests_testresults');
    after(function () {
        console.log("All tests have been completed");
    });
});




