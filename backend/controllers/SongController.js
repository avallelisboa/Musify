'use strict'

const express = require('express');
const api = express.Router();

const bcrypt = require('bcrypt-nodejs');
const Auth = require('../middlewares/authenticate');

const multiparty = require('connect-multiparty');
const upload = multiparty({uploadDir: './uploads/songs'});

const path = require('path');
const fs = require('fs');

const mongoosePaginate = require('mongoose-pagination');

const Song = require('../models/Song');

//Get song by id
api.get('/song/:id', Auth.verifyAuth, (req, res)=>{
    let songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((error, foundedsong)=>{
        if(error){
            return res.status(500).send(json({
                message: "There was an internal error at trying to find the song"
            }));
        }if(!foundedsong){
            return res.status(404).send(json({
                message: "The song was not founded"
            }));
        }else{
            return res.status(200).send(json({
                song: foundedsong,
                message: ""
            }));
        }
    });

});
//Get song by album
api.get('/songs/:albumid', Auth.verifyAuth, (req,res)=>{
    let albumId = req.params.albumid;

    let find;
    if(!albumId)
        find = Song.find({}).sort('number');
    else
        find = Song.find({album: albumId}).sort('number');

    find.populate({
        path: 'album',
        populate:{
            path: 'artist',
            model: 'Artist'
        }
    }).exec((error, foundedsongs)=>{
        if(error){
            return res.status(500).send(json({message: 'The song does not exist'}));
        }if(!foundedsongs){
            return res.status(404).send(json({message: 'There are no songs'}));
        }else{
            return res.status(200).send(json({
                songs: foundedsongs,
                message: ""
            }))
        }
    });
});
//Update song
api.put('/song/id', Auth.verifyAuth, (req, res)=>{
    let songId = req.params.id;
    let update = req.body;

    Song.findByIdAndUpdate(songId, update, (error, songUpdated)=>{
        if(error){
            return res.status(500).send(json({message: 'There was an internal error at trying to update the song'}))
        }if(!songUpdated){
            return res.status(404).send(json({
                message:"The song could not be updated"
            }));
        }else{
            return res.status(200).send(json({
                song: songUpdated,
                message: "The song was updated correctly"
            }));
        }
    });
});
// Add/Remove song methods
api.post('/song', Auth.verifyAuth, (req, res)=>{
    let song = new Song();

    let params = req.body;

    song.number = params.number;
    song.name = params.number;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((error, savedSong)=>{
        if(error){
            return res.status(500).send(json({
                message: "There was an error at saving the song"
            }));
        }if(!savedSong){
            return res.status(404).send(json({
                message: "The song could not be saved"
            }));
        }else{
            return res.status(200).send(json({
                song: savedSong,
                message: "The song was saved correctly"
            }));
        }
    });
});
api.delete('/song/id', Auth.verifyAuth,(req, res)=>{
    let songId = req.params.id;
    let update = req.body;

    Song.findByIdAndRemove(songId, update, (error, songDeleted)=>{
        if(error){
           return res.status(500).send(json({message: 'There was an internal error'}))
        }if(!songDeleted){
            return res.status(404).send(json({
                message: "There was an error at trying to update the song"
            }));
        }else{
            return res.status(200).send(json({
                message: "The song was deleted correctly"
            }));
        }
    });
});


//Upload song file method
api.post('/upload-song/:id', [Auth.verifyAuth, upload], (req, res)=>{
    let songId = req.params.id;
    let fileName = '';

    if(req.file){
        let filePath = req.files.file.path;
        let fileSplit = filePath.split('\\');
        let fileName = file.Split[2];

        let extSplit = fileName.split('\.');
        let ext = extSplit[1];

        if(fileExt == "mp3" || fileExt == "ogg"){
             album.findByIdAndUpdate(songId, {file: fileName},(error, songUpdated)=>{
                if(error){
                    res.status(500).send(json({
                        message: "There was an error while updating the album"
                    }));
                }else if(!songUpdated){
                    res.status(404).send(json({
                        message: "The album could not be updated"
                    }));
                }else res.status(200).send(json({
                    song: songUpdated
                }));
            });
        }
    }else{
        res.status(200).send(json({
            message: "You have not uploaded any file"
        }));
    }
});
//Get song file
api.get('/song-file/', Auth.verifyAuth, (req, res)=>{
    let songFile = req.params.songFile;
    let pathfile = './uploads/songs/' + songFile;

    fs.exists(pathfile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathfile));
        }else{
            return res.status(200).send(json({
                message: "The audio file does not exist"
            }));
        }
    });
});

module.exports = api;