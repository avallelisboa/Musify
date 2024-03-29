'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const {secret, createToken,decodeToken} = require('../services/jwt');

exports.verifyAuth = (req, res, next)=>{
    if(!req.header.authorization){
        return res.status(403).send(json({
           message: "The authetication token is missing" 
        }));
    }
    let token = req.headers.authorization.replace(/['"]+/g,'');

    try{
        let result = decodeToken(token);

        if(!result)
            return res.status(401).send(json({
                message: "The token has expired",
            }));
    }catch(ex){
        console.log(ex);
        return res.status(404).send({message: "The token is not valid"});
    }

    req.user = payload;

    next();
};