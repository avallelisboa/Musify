'use strict'

const express = require('express');
const api = express.Router();
const bcrypt = require('bcrypt-nodejs');

const Song = require('../models/Song');


module.exports = api;