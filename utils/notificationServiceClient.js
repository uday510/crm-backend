/**
 * Logic to make a POST call to the Notification Service
 */
const Client = require("node-rest-client").Client;

const client  = new Client(); //create new client

exports.client = client;


/**
 * Expose a function which will take the following information
 * 
 * subject,
 * content,
 * recipientEmails,
 * requester,
 * tickerId
 * 
 * and the make a POST call
 * 
 */

exports.sendEmail = (ticketId, subject, content, emailIds, requester) => {

    /**
     *! POST call
     *! 
     *!      - URI: 127.0.0.1:4001/notifServ/api/v1/notifications
     *!      - HTTP Verb: POST
     *!      - Request Body
     *!      - Headers
     */
    //? Request body
    const reqBody = {
        subject: subject,
        content: content,
        recipientEmails: emailIds,
        requester: requester,
        ticketId: ticketId
    }

    const headers = {
        "Content-Type": "application/json"
    }

    const args = {
        data: reqBody,
        headers: headers
    }

   client.post("http://127.0.0.1:4001/notifServ/api/v1/notifications", args, (data, response) => {
        console.log("Request sent");
        console.log(data);
    }); 


}


