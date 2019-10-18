const AppError = require("../utils/appError");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = require("../utils/signToken");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

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

exports.protect = catchAsync(async (req, res, next) => {
  // 1)Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access!", 401)
    );
  }

  // 2) Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);
  // 3) check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("the user belonging to this token does no longer exist!", 401)
    );
  }
  // 4) check if user changed password after Jwt was issued

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(" user recently changed !please log in again!", 401)
    );
  }

  req.user = user;
  next();

});

exports.restrict = (...rules) => {
  return (req, res, next) => {
    if (!rules.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    }
    next();
  }
}