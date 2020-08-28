'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const secret = "clavesecretabackend";

const createToken = (user)=>{
    let payload = {
        sub: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(1,'days').unix
    };

    return jwt.encode(payload, secret);
};

module.exports = {
    secret,
    createToken
}