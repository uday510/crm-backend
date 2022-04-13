const express = require("express");
const serverConfig = require("./configs/server.config");
const mongoose = require('mongoose');
const dbConfig = require("./configs/db.config");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(dbConfig.DB_URL, () => {
     console.log(`Connection successful`);
});

require("./routes/auth.routes")(app);

app.listen(serverConfig.PORT, () => {
     console.log(`App listening on port ${serverConfig.PORT}`)
});
