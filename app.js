const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");
const globalErrorHandler = require("./controllers/errorController");

dotenv.config();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP!Please try again in an hour ."
});

app.use(helmet());
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NOSQL DATA INJECTION
app.use(mongoSanitize());

//Data sanitization Against XSS
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "difficulty",
      "price",
      "ratingsAverage",
      "ratingsQuantity"
    ]
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use(globalErrorHandler);

module.exports = app;
