/**
 * This file will have the logic to test the ticket
 * route.
 */

/**
 * Setup th testing database
 */

const User = require("../../models/user.model");
const db = require("../db");
const config = require("../../configs/auth.config");
const client = require("../../utils/NotificationServiceClient").client;
const request = require("supertest");
const app = require("../../server");
const { ticketPriority } = require("../../utils/constants");
const jwt = require("jsonwebtoken");
const Ticket = require("../../models/ticket.model");

/**
 * I need to have the server
 */

beforeAll(async () => {
    
    /**
     * Connection
     */

    /**
     * This will be executed before all the tests.
     */

    await db.clearDatabase();

    /**
     * Insert one test user in the database.
     */
    await User.create({

        name: "Uday",
        userId: 1,
        email: "test@example.com",
        userType: "ENGINEER",
        password: "testing01",
        userStatus: "APPROVED"
    });
});

/**
 * After all the tests are done
 */

/**
 * Test app.post("/crm/api/v1/tickets",
 *      [authJwt.verifyToken], ticketController.createTicket);
 */

const ticketRequestBody = {
    title: "Test 01",
    ticketPriority: 4,
    description: "Test 01",
    status: "OPEN",
    assignee: 1
}

const ticketUpdateRequestBody = {
    title: "Test 01",
    ticketPriority: 4,
    description: "Test 01",
    status: "CLOSED",
    assignee: 1
}

var ticketId;

describe("Testing the POST Ticket creation endpoint", () => {

    const apiEndpoint = "/crm/api/v1/tickets";

    /**
     * 1. Request body - I have
     * 2. JWT Access token in the header
     * 2. POST call
     */

    const token = jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 600
    });

    /**
     * Mock the notification service
     */
    jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));

    it("I should be able to successfully create a ticket", async () => {

        /**
         * Call the API
         * 
         * I need the server, and I need the supertest
         */

        const res = await request(app).post(apiEndpoint)
              .set("x-access-token", token).send(ticketRequestBody);
        
        ticketId = res.body.id;
        console.log(ticketId);
        expect(res.statusCode).toEqual(201);
    });

});

describe("Update ticket: PUT API",  () => {

    const token = jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 600
    });

    /**
     * Mock the notification service
     */
    jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb("Test", null));

    
    it("I should be able to update", async () => {

        const createdTicket = await Ticket.create(ticketRequestBody);
        console.log(createdTicket._id);
        const apiEndPoint = "/crm/api/v1/tickets/" + createdTicket._id;
        const res = await request(app).put(apiEndPoint)
              .set("x-access-token", token).send(ticketUpdateRequestBody);

        expect(res.statusCode).toEqual(200);

    });

});