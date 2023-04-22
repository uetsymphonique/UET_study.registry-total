const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const registrationCentreRouter = require('./routes/registrationCentreRoutes');

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === 'development') {
    app.use(logger('dev'));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.requestTime = Date.now();
    //console.log(req.headers);
    next();
});

app.use('/api/v1/registrationCentres', registrationCentreRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;