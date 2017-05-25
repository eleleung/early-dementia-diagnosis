/**
 * Created by EleanorLeung on 25/05/2017.
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

const Test = require('../models/test');

router.post('/GetTest', passport.authenticate('jwt', {session:false}), function(req, res){
    console.log(req.body);
    console.log(req.user);
});

module.exports = router;