const verifySignup = require("./verifySignup");
const verifySignin = require("./verifySignin");
const authJwt = require("./authjwt");
const verifyAttributes = require("./verifyUpdateAttributes");

module.exports = {
    verifySignup,
    verifySignin,
    authJwt,
    verifyAttributes
}

