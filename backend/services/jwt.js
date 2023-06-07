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
function decodeToken(token){
    let payload = jwt.decode(token, secret);

    if(payload.exp <= moment.unix())
        return false;

    return true;
}

module.exports = {
    secret,
    createToken,
    decodeToken
}