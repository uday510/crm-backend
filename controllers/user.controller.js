 
const Users = require("../models/user.model");
const objectConverter = require("../utils/objectConverter");
/**
 * ! Write the code here to fetch all the Users from the DB
 * 
 * ! Fetch the User documents from the users collection
 */

exports.findAllUsers = async (req, res) => {

    /**
     * Read the data from te query param
     */
    
    const nameReq = req.query.name;
    const userStatusReq = req.query.userStatus;
    const userTypeReq = req.query.userType;
    console.log(userStatusReq);

    const mongoQueryObj = {};

    if(nameReq && userStatusReq && userTypeReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userStatus = userStatusReq;
        mongoQueryObj.userType = userTypeReq;

    } else if(userStatusReq && userTypeReq) {
        mongoQueryObj.userStatus = userStatusReq;
        mongoQueryObj.userType = userTypeReq;

    } else if(nameReq && userStatusReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userStatus = userStatusReq;

    } else if(nameReq && userTypeReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userType = userTypeReq;

    } else if(nameReq) {
        mongoQueryObj.name = nameReq;

    } else if(userTypeReq) {
        mongoQueryObj.userType = userTypeReq;

    } else if(userStatusReq) {
        mongoQueryObj.userStatus = userStatusReq;
    }

    try {
    const users = await Users.find(mongoQueryObj);
    console.log(users);
    return res.status(200).send(objectConverter.userResponse(users));

   } catch(err) {
        console.log(err.message);
        res.status(500).send({
            message: "Internal Server Error, while fetching users"
        });
     }
}

/**
 *! Fetch the user based on the userId
 */

 exports.findUserById = async (req, res) => {
    const userIdReq = req.params.userId;

    const user = await Users.find({userId: userIdReq});

    if(user.length > 0){
        return res.status(200).send(objectConverter.userResponse(user));
    }
    return res.status(500).send({
        message: "User with id " + userIdReq + " doesn't exist"
    });
 }

/**
 *! Update the user - status, userTypes
 *?  - only -ADMIN should be allowed to do this
 */

 exports.updateUser = (req, res) => {
     /**
      * ! One of the ways of updating
      */
     if(!req.params.userId) {
            return res.status(500).send({
            message: "User Id not provided"
        });
     }

     try {
         const userIdReq = req.params.userId;

         const user = Users.findOneAndUpdate({
             userId: userIdReq
         }, {
             name: req.body.name,
             userStatus: req.body.userStatus,
             userType: req.body.userType
         }).exec();
         
         res.status(200).send({
             message: "User record successfully updated"
         });
     } catch (err) {
         console.log(err.message);
         res.status(500).send({
            message: "Internal server error while updating user record"
         });
     }
 }
