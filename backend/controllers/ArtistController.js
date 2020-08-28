'use strict'

const path = require('path');
const fs = require('fs');

const express = require('express');
const api = express.Router();
const mongoosePaginate = require('mongoose-pagination');

const Auth = require('../middlewares/authenticate');

const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');


api.get('/artist/:artist-id', Auth.verifyAuth, (req, res)=>{
    let artistId = req.params.id;

    Artist.findById(artistId)
            .then((artistFounded)=>{
                res.status(200).send(json({
                    artist: artistFounded
                }));
            })
            .catch((error)=>{
                res.status(404).send(json({
                    message: "The artist was not founded"
                }));
            });
});

api.get('/artists', Auth.verifyAuth, (req, res) =>{
    let page = req.params.page;
    let itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage)
                                .then((artists,total)=>{
                                    res.status(200).send(json({
                                        artists: artists,
                                        pages: total
                                    }));
                                })
                                .catch((error)=>{
                                    res.status(500).send(json({
                                        message: "There was a problem with the pagination"
                                    }));
                                });
});

api.post('/new-artist', Auth.verifyAuth, (req, res)=>{
    let params = req.body;

    if(!params) res.status(200).send(json({
        message: "You need to specify the parameters to register a new Artist"
    }));

    let artist = new Artist();

    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    artist.save()
            .then((artistStored)=>{
                res.status(200).send(json({
                    artist: artistStored,
                }));
            })
            .catch((error)=>{
                res.status(500).send(json({
                    message: "There was a problem at saving the artist"
                }));
            });
});

module.exports = api;