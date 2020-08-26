'use strict'

const express = require('express');
const api = express.Router();

const User = require('../models/User');

api.get('/user')

api.get('/users',(req, res)=>{
    let users = User.find({},(error, users)=>{
        return res.json(users);
    });
});


module.exports = api;