'use strict'

const path = require('path');
const fs = require('fs');

const express = require('express');
const api = express.Router();
const mongoosePaginate = require('mongoose-pagination');

const Auth = require('../middlewares/authenticate');

const multiparty = require('connect-multiparty');
const upload = multiparty({uploadDir: './uploads/album'});

const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');


api.get('/album/:id', Auth.verifyAuth, (req, res)=>{
    let albumId = req.params.id;

    if(!albumId) res.status(200).send(json({
        message: "You must specify the id of the album"
    }));

    Album.findById(albumId).populate({path: 'artist'}).exec()
            .then((albumFounded)=>{
                res.status(200).send(json({
                    album: albumFounded
                }));
            })
            .catch((error)=>{
                res.status(404).send(json({
                    message: "The artist was not founded"
                }));
            });
});

api.get('/albums/:artistid', Auth.verifyAuth, (req, res)=>{
    let artistId = req.params.artistid;

    if(!artistId) res.status(200).send(json({
        message: "You must specify the id of the artist"
    }));

    Album.find({artist: artistId}).sort('year').populate({path: 'artist'}).exec()
                                    .then((albums)=>{
                                        res.status(200).send(json(albums));
                                    })
                                    .catch((error)=>{
                                        res.status(404).send(json({
                                            message:"There was a problem at finding the albums of this artist"
                                        }));
                                    });
});

api.post('/addalbum', Auth.verifyAuth, (req, res)=>{
    if(!req.body) res.status(200).send(json({
        message: "You must include in the body the data about the album"
    }));

    let params = res.body;
    let album = new Album();

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;

    album.save()
            .then((albumSaved)=>{
                res.status(200).send(json({
                    album: albumSaved
                }));
            })
            .catch((error)=>{
                res.status(500).send(json({
                    message: "There was a problem at trying to save the album"
                }));
            });

});

api.put('/update-album/:id', Auth.verifyAuth, (req, res)=>{
    let albumId = req.params.id;
    let update = req.body;
    
    album.findByIdAndUpdate(albumId, update)
            .then((albumUpdated)=>{
                res.status(200).send(json({
                    album: albumUpdated
                }));
            })
            .catch((error)=>{
                res.status(500).send(json({
                    message: "There was a problem at updating the album"
                }))
            });
});

api.delete('/delete-album/:id', Auth.verifyAuth, (req, res)=>{
    let albumId = req.params.id;
    
    album.findByIdAndRemove(albumId)
            .then((albumDeleted)=>{
                res.status(200).send(json({
                    album: albumDeleted,
                    message: "The album was deleted successfully"
                }))
            })
            .catch((error)=>{
                res.status(500).send(json({
                    message: "There was a problem at deleting the album"
                }));
            });
});

api.post('/upload-album-image/:id', [Auth.verifyAuth, upload], (req, res)=>{
    let albumtId = req.params.id;
    let fileName = '';

    if(req.file){
        let filePath = req.files.image.path;
        let fileSplit = filePath.split('\\');
        let fileName = file.Split[2];

        let extSplit = fileName.split('\.');
        let ext = extSplit[1];

        if(fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif"){
             album.findByIdAndUpdate(albumId, {image: fileName},(error, albumUpdated)=>{
                if(error){
                    res.status(500).send(json({
                        message: "There was an error while updating the album"
                    }));
                }else if(!albumUpdated){
                    res.status(404).send(json({
                        message: "The album could not be updated"
                    }));
                }else res.status(200).send(json({
                    album: albumUpdated
                }));
            });
        }
    }else{
        res.status(200).send(json({
            message: "You have not uploaded any file"
        }));
    }
});

api.get('/get-album-image/:id', Auth.verifyAuth, (req, res)=>{
    let imageFile = req.params.imageFile;
    let pathFile = './uploads/albums/' + imageFile;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else res.status(404).send(json({
            message: "The image was not founded"
        }));
    });
});

module.exports = api;