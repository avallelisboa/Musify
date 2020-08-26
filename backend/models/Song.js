'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Song = Schema({
    number: Number,
    name: String,
    duration: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', Song);