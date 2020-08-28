'use strict'

const fs = require('fs');
const path = require('path');

const express = require('express');
const api = express.Router();

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Auth = require('../middlewares/authenticate');

const multiparty = require('connect-multiparty');
const upload = multiparty({uploadDir: './uploads/users'});

const User = require('../models/User');
const { json } = require('body-parser');


api.post('/register', (req, res)=>{
    if(!req.body){
        return res.status(200).send(json({
            message: "There are no parameters",
        }));
    } 

    let user = new User();

    user.name = req.body.name;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.role = "user";
    user.image = null;

    if(user.name == null || user.lastName == null || user.email == null)
        return res.status(200).send(json({
            message: "The name, the last name and the email cannot be empty",
        }));

    if(req.body.password){
        bcrypt.hash(req.body.password,null,(error,result)=>{
            if(error) return res.status(500).send(json({
                message: "There was a problem with the password entered"
            }));
            user.password = result;
            user.save((error, userSaved)=>{
                if(error) return res.status(500).send(json({
                    message: "There was a problem at saving the user",
                }));
                return res.status(200).send(json({
                    user: userSaved,
                    message: "The user was registered successfully",
                }))
            });
        });
    }else return res.status(200).send(json({
        message: "Enter the password",
    }));
});

api.post('/login', Auth.verifyAuth, (req,res)=>{
    let params = req.body;

    let email = params.email;
    let password = params.password;

    if(email == null || password == null) return res.status(200).send(json({
        message: "The email and the password cannot be empty",
    }));

    User.findOne({email: email},(error, user)=>{
        if(error) return res.status(404).send(json({
            message:"The email is not registered",
        }));
        if(user){
            bcrypt.compare(password, user.password,(error, result)=>{
                if(error) return res.status(500).send(json({
                    message:"There was a problem"
                }));
                if(!result) return res.status(200).send(json({
                    message: "The password is not correct",
                }));

                return res.status(200).send(json({
                    message: "The user has logged in correctly",
                    token: jwt.createToken(user)
                }));
            });
        }
    });
});

api.put('/update-user/', Auth.verifyAuth, (req, res)=>{
    let userId = req.sub;
    let update = req.body;

    if(!userId) res.status(200).send(json({
        message: "You must enter the userId"
    }));

    User.findByIdAndUpdate(userId,update,(error, userUpdated)=>{
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
});

api.post('/upload-image', [Auth.verifyAuth, upload], (req, res)=>{
    let userId = req.params.id;

    if(req.file){
        let filePath = req.files.image.path;
        let fileSplit = filePath.split('\\');
        let fileName = file.Split[2];

        let extSplit = fileName.split('\.');
        let ext = extSplit[1];

        if(fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif"){
            User.findByIdAndUpdate(userId, {image: fileName},(error, userUpdated)=>{
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

api.get('/get-image/:image-file', Auth.verifyAuth,(req, res)=>{
    let imageFile = req.params.imageFile;
    let pathFile = './uploads/users/' + imageFile;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else res.status(404).send(json({
            message: "The image was not founded"
        }));
    });
});

module.exports = api;