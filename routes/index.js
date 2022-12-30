const express = require('express');

// Import our modular routers for /tips and /feedback
const noteRouter = require('./notes');

const app = express();

app.use('/notes', noteRouter);

module.exports = app;
