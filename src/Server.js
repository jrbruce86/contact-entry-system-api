// Server.js


// Grab the configuration
const config = require("config");

// Express - web framework
const express = require("express");
const app = express();
const PORT = config.get("port"); // TODO make configurable
// use only when you want to see the metric related to express app
// app.use(require('express-status-monitor')());


// TODO use awilix to load up the DI object graph (Routes at the top...)




app.listen(PORT, function() {
  console.log('Server is running on PORT:',PORT);
});


