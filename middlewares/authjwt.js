const jwt = require("jsonwebtoken");
const Config = require("../configs/auth.config");
const User = require("../models/user.model");
const Constants = require("../utils/constants");
/**
 * ! Authentication
 * 
 * ? If the token passed is valid or not
 * 
 * ? 1. If no token is passes in the request header - Not Allowed
 * ? 2. If token is passed : Authentication
 *       !  If correct allow else reject
 * 
 */

verifyToken = (req, res, next) => {

    /**
     * ! Read the token from the header
     */

    const token = req.headers['x-access-token'];

    if(!token) {
        return res.status(403).send({
            message: "No token provided"
        });
    }

    console.log("token >>", token);
    //! If the token was provided, we need to verify it against
    jwt.verify(token, Config.secret, (err, decoded) =>{
        if(err) {
            console.log("Token expiredAt", err.expiredAt);
            return res.status(401).send({
                message: "Token expired at " + err.expiredAt + ", please create new token"
            });
        } 
        //! I will try to read the userId from the decoded token and store it in the req.userId property
        req.userId = decoded.id;
        next();
    });
}

isAdmin = async (req, res, next) => {
    /**
     * Fetch user from the DB using req.userId
     */
    const user = await User.findOne({userId: req.userId});

    /**
     * Check the userType
     */
    if(!user) {
         return res.status(403).send({
            message: "No user Found"
        });
    }
    else if(user && user.userType == Constants.userTypes.admin)
        next();
    else {
        return res.status(403).send({
            message: "Requires ADMIN Role"
        });
    }
}
const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin
};

module.exports = authJwt;