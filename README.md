#Customer Relationship Management

## Features

- Client can signup and login.
- Client can create a ticket.
- Client can get all the tickets created.
- Client can update a ticket.

## How is the code organized in this repo ?

The whole codebase is present in the single branch [main]

## Prerequisite

- Understanding of Node.js
- Understanding of Async Await
- Mongo DB locally installed and running

## Tech

- Node.js
- mongoDB

## Installation

this app requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd movieBookingApplication
npm install
npm run devStart
```

## Rest endpoints

#### 1. Raise a new ecommerce-backed request

```sh
GET /crm/api/v1/tickets
Headers :
 Content-Type:application/json
Make the changes and raise a PR. Reach out to me over budayteja009@gmail.com

Sample response body :
{
    "name": "uday",
    "userId": "1234",
    "email": "example@email.com",
    "userType": "CUSTOMER",
    "userStatus": "APPROVED",
    "createdAt": "2022-08-30T16:20:19.215Z",
    "updatedAt": "2022-08-30T16:20:19.215Z"
}
```
