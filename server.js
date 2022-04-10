const express = require('express')();
const serverConfig = require("./configs/server.config");
const mongoose = require('mongoose');
const dbConfig = require("./configs/db.config");

mongoose.connect(dbConfig.DB_URL, () => {
     console.log(`Connected to MongoDB...`);
});

express.listen(serverConfig.PORT, () => {
     console.log(`App listening on port ${serverConfig.PORT}`)
});
