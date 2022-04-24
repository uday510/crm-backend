const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

verifyUpdateAttributes = async (req, res, next) => { 

    //! Check if the ticket exists

    const ticket = await Ticket.findOne({
        _id: req.params.id
    }); 

    console.log(ticket);

    if(!ticket) {
        return res.status(400).send({
            message: "No ticket found for the given ticketId."
        });
    }

    /**
    * ? Only the ticket created allowed to update the ticket.
    */
    const user = await User.findOne({
        userId: req.userId
    });

    console.log("user", user);
    if(!user.ticketsCreated.includes(req.params.id)) {
        return res.status(403).send({
            message: "Only owner of the ticket allowed to update the ticket."
        });
    }
    next();
}

module.exports = {verifyUpdateAttributes}