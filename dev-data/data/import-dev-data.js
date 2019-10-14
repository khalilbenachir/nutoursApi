const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config();

const DB = process.env.DB_ACCESS.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(conn => {
    console.log("DB connected");
  })
  .catch(err => {
    console.log(err.message);
  });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

console.log(tours);

const importData = async () => {
  try {
      await Tour.create(tours);
      console.log("DATA successfully loaded");
      process.exit();

  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
      await Tour.deleteMany();
      process.exit();
    console.log("DATA successfully deleted ");
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteData();

console.log(process.argv);
