const dotenv = require('dotenv');
const app = require('./app');
process.on('uncaughtException', (err) => {
    console.log('Uncaught rejection!!! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const mongoose = require('mongoose');

dotenv.config({path: './config.env'});

const database = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(database, {
        useNewUrlParser: true,
    })
    .then((conn) => {
        //console.log(conn.connections);
        console.log('Database connected successfully!!');
    })
    .catch((err) => {
        console.log('Database connected unsuccessfully!! ERROR: ' + err.message);
    });
console.log(process.env.PORT);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection!!! Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

