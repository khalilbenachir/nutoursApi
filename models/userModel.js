const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto')

const catchAsync = require('../utils/catchAsync');

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"]
  },
  email: {
    type: String,
    required: [true, "A user must have a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email "]
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must have a confirm password"],
    validate: {
      //this only work on create and save
      validator: function(el) {
        return el === this.password;
      },
      message: "password are not same"
    }
  },
  role: {
    type: String,
    required: [true, "A user must have a role"],
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default:'user'
  },
  active: {
    type: Boolean,
    default: true
  },
  photo: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordExpiredToken:Date
});

userModel.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  //delete confirm password field
  this.passwordConfirm = undefined;
  next();
});

userModel.pre('save',function (next) {
  if (!this.isModified('password') || this.isNew) next();
  //because sometimes when the database is big the token will create before the passwordchagedAt
  this.passwordChangedAt = Date.now() -1000;
  next();
})

userModel.methods.correctPassword = async function(
  candidatePassword,
  userpassword
) {
  return await bcrypt.compare(candidatePassword, userpassword);
};

userModel.methods.changedPasswordAfter = function(jwtTimesTamp) {
  if (this.passwordChangedAt) {
    const changedTimesTam = parseInt(this.passwordChangedAt.getTime() / 1000);
    return jwtTimesTamp < changedTimesTam;
  }
  return false;
};

userModel.methods.createPasswordResetToken = function () {
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordExpiredToken = Date.now() + (10 * 60 * 1000);
  return resetToken;
} 
  
const User = mongoose.model("User", userModel);
module.exports = User;
