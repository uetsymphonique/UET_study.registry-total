const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const registrationCentreRouter = require("./routes/registrationCentreRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

//console.log(process.env.NODE_ENV);
//application-level middleware
//set security http headers
app.use(helmet());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//development logging
if (process.env.NODE_ENV.trim() === "development") {
  app.use(logger("dev"));
}

// limit requests from api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// body parser, reading data from body to req.body
app.use(express.json());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

//prevent http param pollution
app.use(hpp());

// serving static files
app.use(express.static(`${__dirname}/public`));

app.use(compression());
//test middleware
app.use((req, res, next) => {
  req.requestTime = Date.now();
  //console.log(req.headers);
  next();
});
app.use("/api/v1/registrationCentres", registrationCentreRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
