const ticketController = require("../controllers/ticket.controller");
const {authJwt} = require("../middlewares");
const {verifyAttributes} = require("../middlewares");

module.exports = (app) => {
    app.post("/crm/api/v1/tickets",[authJwt.verifyToken], ticketController.createTicket);

    app.get("/crm/api/v1/tickets", [authJwt.verifyToken], ticketController.getAllTickets);

    app.get("/crm/api/v1/tickets/:id", [authJwt.verifyToken], ticketController.getOneTicket);

    app.put("/crm/api/v1/tickets/update/:id", [authJwt.verifyToken, verifyAttributes.verifyUpdateAttributes],  ticketController.updateTicket);
}

