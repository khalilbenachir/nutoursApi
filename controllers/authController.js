const AppError = require("../utils/appError");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = require("../utils/signToken");

exports.signUp = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      users: user
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token
  });
});
