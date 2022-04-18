const express = require("express");
const serverConfig = require("./configs/server.config");
const mongoose = require('mongoose');
const dbConfig = require("./configs/db.config");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbConfig.DB_URL, () => {
     console.log(`Connecting to MongoDB...`);
     console.log(`Connection successful`);
     // Intialization
     init();
});

const init = async () => {

     var user = await User.findOne({userId: "admin"});

     if(user) {
          return;
     }
     //Create the admin Role
     user = await User.create({
          name: "Uday",
          userId: "admin",
          email: "admin@email.com",
          userType: "ADMIN",
          password: bcrypt.hashSync("password", 8)
     });  
     console.log("Admin role created");
}

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);

app.listen(serverConfig.PORT, () => {
     console.log(`App listening on port ${serverConfig.PORT}`)
});
