const ticketController = require("../controllers/ticket.controller");
const {authJwt} = require("../middlewares");
const {verifyAttributes} = require("../middlewares");

module.exports = (app) => {
    app.post("/crm/api/v1/tickets",[authJwt.verifyToken], ticketController.createTicket);

    app.get("/crm/api/v1/tickets", [authJwt.verifyToken], ticketController.getAllTickets);

    app.get("/crm/api/v1/tickets/:id", [authJwt.verifyToken], ticketController.getOneTicket);
     // 127.0.0.1:4000/crm/api/v1/tickets/627396b608d41d869e878fa9

    app.put("/crm/api/v1/tickets/:id", [authJwt.verifyToken, verifyAttributes.verifyUpdateAttributes],  ticketController.updateTicket);
     // 127.0.0.1:4000/crm/api/v1/tickets/627396b608d41d869e878fa9
}

