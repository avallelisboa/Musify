'use strict'

const express = require('express');
const api = express.Router();
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/User');

api.get('/users',(req, res)=>{
    let users = User.find({},(error, users)=>{
        return res.status(200).send(json(users));
    });
});
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
        }))

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

api.post('/login', (req,res)=>{
    
});


module.exports = api;