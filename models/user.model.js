const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    /**
     *? name, userId, email, password, createdAt, updatedAt
     *? userType [ADMIN | ENGINEER | CUSTOMER],
     *? userStatus [Pending | Approved | Rejected]
     */
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowerCase: true,
        minLength: 10,
        unique: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => { 
            return Date.now();
        }
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    },
    userType: {
         type: String,
         required: true,
         default: "CUSTOMER"
    },
    userStatus: {
        type: String,
        required: true,
        default: "APPROVED"    
    },
    ticketsCreated: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    },
    ticketsAssigned: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    },
});

module.exports = mongoose.model("User", userSchema);