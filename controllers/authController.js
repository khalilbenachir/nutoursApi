const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const crypto = require("crypto");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const signToken = require("../utils/signToken");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "production") cookieOption.secure = true;


  res.cookie("jwt", token, cookieOption);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      users: user
    }
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  createSendToken(user, 201, res);
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

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1)Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access!", 401)
    );
  }

  // 2) Verification token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "the user belonging to this token does no longer exist!",
        401
      )
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
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError("There s no user with this email address", 404));

  //2) generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send it to users s email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forget your password ? submit a patch request with your new password and passwordConfirm to : ${resetUrl}.\n if you didn't forget your password,please ignore this email.`;

  try {
    console.log(resetUrl);
    await sendEmail({
      email: user.email,
      subject: "your password reset token (valid for 10 min",
      message: message
    });
    res.status(200).json({
      status: "success",
      message: "token send to email"
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordExpiredToken = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    return next(
      new AppError(
        "there was an error while sending email ! try again later.",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // 2 if the token not expired and there is user set the new password
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordExpiredToken: { $gt: Date.now() }
  });
  console.log(user, "=========");
  if (!user) return next(new AppError("Token is invalid or has expired!", 400));
  //3 updated changedPasswordAt property for the user

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordExpiredToken = undefined;
  await user.save();
  // 4 log teh user in ,JWT token
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2 check if posted password is correct
  if (!(await user.correctPassword(req.body.Currentpassword, user.password))) {
    return next(new AppError("password is incorrect!", 401));
  }
  // 3 if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4 log user in ,JWT TOKEN
  createSendToken(user, 200, res);
});
