const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === 'development') {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;