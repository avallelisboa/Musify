'use strict'

require('dotenv').config();
const express = require('express');
const expressport = process.env.SERVERPORT;
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const mongoport = process.env.MONGOPORT;
const mongourl = 'mongodb://localhost:'+ mongoport + '/backend';

const UserController = require('./controllers/UserController');
const SongController = require('./controllers/SongController');
const ArtistController = require('./controllers/ArtistController');
const AlbumController = require('./controllers/AlbumController');



const app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((req,res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, accept, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

    next();
});

app.use(UserController);
app.use(SongController);
app.use(ArtistController);
app.use(AlbumController);


mongoose.connect(mongourl, (error)=>{
    console.log(error);
});
app.listen(expressport,()=>{
    console.log("the server is listening at " + expressport);
});

module.exports = app;