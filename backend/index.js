'use strict'

const express = require('express');
const expressport = process.env.port || 3977;
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const mongoport = 27017;
const mongourl = 'mongodb://localhost:'+ mongoport + '/backend';

const UserController = require('./controllers/UserController');
const SongController = require('./controllers/SongController');
const ArtistController = require('./controllers/ArtistController');
const AlbumController = require('./controllers/AlbumController');

/*mongoose.connect(mongourl)
        .then(()=>{
            console.log("The database is working in" + mongourl);
        })
        .catch((error)=>{
            console.log(error);
        });*/

const app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use(UserController);
app.use(SongController);
app.use(ArtistController);
app.use(AlbumController);

new Promise(()=> app.listen(expressport))
                    .then(()=>{
                        console.log("the server is listening at " + expressport);
                    })
                    .catch((error)=>{
                        console.log(error);
                    });

module.exports = app;