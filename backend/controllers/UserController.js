'use strict'

const express = require('express');
const api = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Auth = require('../middlewares/authenticate');

const User = require('../models/User');


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


module.exports = api;