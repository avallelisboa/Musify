'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Album = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist'}
});

module.exports = mongoose.model('Album', Album);