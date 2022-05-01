const User = require("../models/user.model");
const constants = require("../utils/constants");
const Ticket = require("../models/ticket.model");
const notificationServiceClient = require("../utils/NotificationServiceClient");

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
        console.log(ticket);

         /**
          * Ticket is created now
          * 1. We should update the customer and engineer document
          */
         /**
          * Find out the customer
          */

        if(ticket) {
            const user = await User.findOne({
                userId: req.userId
            });
            user.ticketsCreated.push(ticket._id);
            await user.save();
        /**
         * Update the engineer
         */
            engineer.ticketsAssigned.push(ticket._id);
            await engineer.save();

        /**
         *! Right place to send the email 
         *! 
         *! call the notificationService to send the email
         *! 
         *! I need to have a client to call the external service
         */
        notificationServiceClient.sendEmail(ticket._id, "Created new ticket :"+ticket._id,ticket.description, user.email+","+engineer.email,user.email);

        return res.status(201).send(objectConverter.ticketResponse(ticket));
    }
 } catch (err) {

        console.log(err.message);

        return res.status(500).send({
            message: "Some internal error"
        });
    }
}

/**
 * ! 16/04/2022
 * ! API to fetch all the tickets 
 * 
 * ! 20/04/2022
 * ? Depending on the user I need to return different list of tickets.
 * 
 * ! 1. ADMIN - Return all tickets
 * ! 2. ENGINEER - Return all the tickets, either created or assigned
 * ! 3. CUSTOMER - RETURN all the tickets created.
 */

exports.getAllTickets = async (req, res) => {

    console.log(req.userId);

    // console.log("user", user);
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

    // console.log(req.query.status);

    const queryObj = {};
    if(req.query.status != undefined) {
        queryObj.status = req.query.status
    }

    const user = await User.findOne({userId: req.userId});
    if(user.userType == constants.userTypes.admin) {
        // Return all the users
        // No need to change anything in the query object
    } else if(user.userType == constants.userTypes.customer) {

        if(user.ticketsCreated == null || user.ticketsCreated.length == 0) {
            return res.status(200).send({
                message: "No tickets created by you."
            });
        }
        queryObj._id = {
            $in: user.ticketsCreated // Array of tickets.
        }
    } else {
         /** 
          * ! User is of type engineer
          * Approach 1: $or ---
          *
          * Approach 2: In the clause put both the lists
          *         ticketsCreated
          *         ticketsAssigned
          */
         queryObj._id = {
             $in: user.ticketsCreated // Array of ticket ids
         };
         //! All the tickets where I am the assignee
         queryObj.assignee = req.userId
    }
    const tickets = await Ticket.find(queryObj);

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

    //check if the ticket exists
    const ticket = await Ticket.findOne({
        _id: req.params.id
    }); 
    
    console.log(ticket);

    const user = await User.findOne({
        userId: req.userId
    });

      /**
     * If the ticket is not assigned to any engineer, any engineer
     * can self assign themselves the given ticket.
     */

    if(ticket.assignee == undefined) {
        ticket.assignee = req.userId;
    }

    //! Update the attributes of the saved ticket

    ticket.title = req.body.title != undefined ? req.body.title: ticket.title;
    ticket.description = req.body.description != undefined ? req.body.description: ticket.description;
    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority: ticket.ticketPriority;
    ticket.status = req.body.status != undefined ? req.body.status: ticket.status;

    ticket.updatedAt = Date.now();
    
    //? Ability ot re-assign the ticket
    if(user.userType == constants.userTypes.admin) {
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee: ticket.assignee;
    }
    
    //! Save the changed ticket

    const updatedTicket = await ticket.save();

    //! Return the updated ticket

    return res.status(200).send(objectConverter.ticketResponse(updatedTicket));

}
