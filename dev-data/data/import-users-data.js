const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const User = require("../../models/userModel");

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

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);

console.log(users);

const importData = async () => {
  try {
      await User.create(users);
      console.log("DATA successfully loaded");
      process.exit();

  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
      await User.deleteMany();
      console.log("DATA successfully deleted ");
      process.exit();

  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--delete") deleteData();

console.log(process.argv);
