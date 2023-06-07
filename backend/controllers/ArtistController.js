'use strict'

const path = require('path');
const fs = require('fs');

const express = require('express');
const api = express.Router();
const mongoosePaginate = require('mongoose-pagination');

const Auth = require('../middlewares/authenticate');

const multiparty = require('connect-multiparty');
const upload = multiparty({uploadDir: './uploads/artist'});

const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');


api.get('/artist/:id', Auth.verifyAuth, (req, res)=>{
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

api.get('/artists/:page', Auth.verifyAuth, (req, res) =>{
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

api.put('/update-artist/:id', Auth.verifyAuth, (req, res)=>{
    let artistId = req.params.id;
    let update = req.body;

    Artist.findByIdAndUpdate(artistId, update)
            .then((artistUpdated)=>{
                res.status(500).send(json({
                    artist: artistUpdated
                }));
            })
            .catch((error)=>{

            });
});

api.delete('/delete-artist/:id', Auth.verifyAuth, (req, res)=>{
    let artistId = req.params.id;

    Artist.findByIdAndRemove(artistId)
            .then((artistRemoved)=>{
                Album.find({artist: artistId._id}).remove()
                        .then((albumRemoved)=>{
                            Song.find({album: albumRemoved._id}).remove()
                            .then((songRemoved)=>{
                                res.status(200).send(json({
                                    message: "The artist was deleted correctly"
                                }));
                            })
                            .catch((error)=>{
                                res.status(500).send(json({
                                    message: "There was an error at trying to delete the song"
                                }));
                            });
                        })
                        .catch((error)=>{
                            res.status(500).send(json({
                                message: "There was an error at trying to delete the album"
                            }));
                        });

                res.status(200).send(json({
                    artist: artistRemoved,
                    message: "The artist was deleted successfully"
                }));
            })
            .catch((error)=>{
                res.status(500).send(json({
                    message: "There was an error at trying to delete the artist"
                }));
            });
});

api.post('/upload-artist-image/:id',[Auth.verifyAuth, upload], (req, res)=>{
    let artistId = req.params.id;
    let fileName = '';

    if(req.file){
        let filePath = req.files.image.path;
        let fileSplit = filePath.split('\\');
        let fileName = file.Split[2];

        let extSplit = fileName.split('\.');
        let ext = extSplit[1];

        if(fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif"){
            user.findByIdAndUpdate(userId, {image: fileName},(error, userUpdated)=>{
                if(error){
                    res.status(500).send(json({
                        message: "There was an error while updating the user"
                    }));
                }else if(!userUpdated){
                    res.status(404).send(json({
                        message: "The user could not be updated"
                    }));
                }else res.status(200).send(json({
                    user: userUpdated
                }));
            });
        }
    }else{
        res.status(200).send(json({
            message: "You have not uploaded any file"
        }));
    }
});

api.get('/get-artist-image/:imageFile', Auth.verifyAuth,(req, res)=>{
    let imageFile = req.params.imageFile;
    let pathFile = './uploads/artists/' + imageFile;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else res.status(404).send(json({
            message: "The image was not founded"
        }));
    });
});

module.exports = api;