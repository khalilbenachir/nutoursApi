const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"]
  },
  email: {
    type: String,
    required: [true, "A tour must have a email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email "]
  },
  password: {
    type: String,
    required: [true, "A tour must have a password"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "A tour must have a password"],
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
    required: [true, "A tour must have a role"],
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default:'user'
  },
  active: {
    type: Boolean,
    default: true
  },
  photo: String,
  passwordChangedAt: Date
});

userModel.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  //delete confirm password field
  this.passwordConfirm = undefined;
  next();
});

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

const User = mongoose.model("User", userModel);
module.exports = User;
