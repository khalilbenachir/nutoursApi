const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(`${__dirname}/public`));


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);




module.exports = app;
