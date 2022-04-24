const User = require("../models/user.model");
const constants = require("../utils/constants");
const Ticket = require("../models/ticket.model");

const objectConverter = require("../utils/objectConverter");

/**
 * Create a ticket 
 * todo v1 - Any one should be able to create the ticket
 */

exports.createTicket = async (req, res) => {

    // Logic to create the ticket

    const ticketObj = {
        title: req.body.title,
        ticketPriority: req.body.ticketPriority,
        description: req.body.description
    }
    // console.log(ticketObj);

     /**
     *? If any Engineer is available
     */

    try {
        const engineer = await User.findOne({
            userType: constants.userTypes.engineer,
            userStatus: constants.userStatus.approved
        });

        if(engineer) {
            ticketObj.assignee = engineer.userId;
        }

        const ticket = await Ticket.create(ticketObj);

         /**
          * Ticket is created now
          * 1. We should update the customer and engineer document
          */
         /**
          * Find out the customer
          */

        if(ticket) {
            console.log("TICKET CREATED", ticket);
            const user = await User.findOne({
                userId: req.userId
            });
            console.log("user", user);
            user.ticketsCreated.push(ticket._id);
            await user.save();
        }
        /**
         * Update the engineer
         */
            engineer.ticketsAssigned.push(engineer._id);
            await engineer.save();

        return res.status(201).send(objectConverter.ticketResponse(ticket))
    } catch (err) {

        console.log("Error", err.message);

        return res.status(500).send({
            message: "Some internal error"
        });
    }
}

/**
 * ! 16/04/2022
 * ! API to fetch all the tickets 
 */

exports.getAllTickets = async (req, res) => {

    console.log(req.userId);

    // const user = await User.findOne({userId: req.userId});
    const user = await User.findOne({userId: req.userId});
    // console.log(user);
   
    if(user.ticketsCreated == null || user.ticketsCreated.length == 0) {
        return res.status(200).send({
            message: "No tickets were created by you !!!"
        });
    }

    // const tickets = [];
    // var count = 0;
    // console.log(user.ticketsCreated);
    // user.ticketsCreated.forEach(async t => {
    //     var ticketSaved = await Ticket.findOne({_id: t});
    //     console.log(ticketSaved);
    //     tickets.push(ticketSaved);
    //     if(++count >= user.ticketsCreated.length) {
    //         console.log("TICKETS : ", tickets);
    //         return res.status(200).send(objectConverter.ticketListResponse(tickets));
    //     }
    // });

    console.log(req.query.status);
    const tickets = await Ticket.find({
        _id: {
            $in: user.ticketsCreated
        },
        status: req.query.status 
    });
    res.status(200).send(objectConverter.ticketListResponse(tickets));

}

/**
* ! Controller to fetch ticket based on id
*/

exports.getOneTicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id
    });
    
    res.status(200).send(objectConverter.ticketResponse(ticket));
}

/**
* ! Controller to update the ticket
*/

exports.updateTicket = async (req, res) => {

    const ticket = await Ticket.findOne({
        _id: req.params.id
    }); 

    //! Update the attributes of the saved ticket
    
    ticket.title = req.body.title != undefined ? req.body.title: ticket.title;
    ticket.description = req.body.description != undefined ? req.body.description: ticket.description;
    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority: ticket.ticketPriority;
    ticket.status = req.body.status != undefined ? req.body.status: ticket.status;
    
    //! Save the changed ticket

    const updatedTicket = await ticket.save();

    //! Return the updated ticket

    return res.status(200).send(objectConverter.ticketResponse(updatedTicket));

}
