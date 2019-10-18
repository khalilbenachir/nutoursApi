const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res,next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users
    }
  });
});

const createUser = (req, res) => {};

const getUserById = (req, res) => {};

module.exports = { getAllUsers, createUser, getUserById };
