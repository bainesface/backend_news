const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { handleCustomErrors, handlePSQLErrors } = require('./errors.js');

app.use(express.json());

app.use('/api', apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);

module.exports = app;
