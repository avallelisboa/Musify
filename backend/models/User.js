'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mognoose.model('User', User);