const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode)
        .json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
};
const sendErrorProd = (err, res) => {
    //Operational, trusted error: send msg to client
    if (err.isOperational) {
        //console.log(err);
        res.status(err.statusCode)
            .json({
                status: err.status,
                message: err.message,
            });
        //Programing or other error: don't leak error details
    } else {
        console.error('Error: ', err);
        res.status(500)
            .json({
                status: 'error',
                message: 'Có lỗi đã xảy ra!',
            });
    }
};
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value instead`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors)
        .map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleJWTError = (err) => {
    return new AppError('Token không hợp lệ. Vui lòng đăng nhập lại!', 401)
};
const handleJWTExpiredError = (err) => {
    return new AppError('Phiên đã hết hạn. Vui lòng đăng nhập lại', 401)
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; //internal server error
    err.status = err.status || 'error';

    if (process.env.NODE_ENV.trim() === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV.trim() === 'production') {

        let error = err;

        if (err.name === 'CastError') {
            error = handleCastErrorDB(error);
        }
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }
        if (err.name === 'JsonWebTokenError') {
            error = handleJWTError(error);
        }
        if (err.name === 'TokenExpiredError') {
            error = handleJWTExpiredError(error);
        }
        sendErrorProd(error, res);
    }
};
