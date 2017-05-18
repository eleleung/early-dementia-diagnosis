/**
 * Created by EleanorLeung on 10/05/2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Doctor = require('../models/doctor');

module.exports = router;