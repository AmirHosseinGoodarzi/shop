const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const ENUMS = require('../utils/Enums');

const userSchema = new mongoose.Schema({
  name: String,
  family: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'لطفا ایمیل معتبر وارد نمایید'],
  },
  mobile: {
    type: String,
    // required: [true, 'پر کردن فیلد شماره موبایل الزامی است'],
    validate: {
      validator: function (val) {
        // this only points to current doc on NEW document creation
        return val.length === 11;
      },
      message: 'لطفا شماره موبایل معتبر وارد نمایید',
    },
  },
  profileImage: String,
  nationalCode: String,
  role: {
    type: String,
    enum: [
      ENUMS.USER_ROLES.ADMIN,
      ENUMS.USER_ROLES.PRODUCT_MANAGER,
      ENUMS.USER_ROLES.SUPPORT,
      ENUMS.USER_ROLES.USER,
    ],
    default: ENUMS.USER_ROLES.USER,
  },
  Cart: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  Favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
  otpCode: {
    type: String,
    select: false,
  },
  otpCodeExpires: {
    type: Date,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  banReason: String,
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'رمز عبور و تکرار آن با هم مطابقت ندارند',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// just find active users
// userSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

// otp operations
userSchema.methods.generateOtpCode = async function () {
  if (this.otpCodeExpires && Date.parse(this.otpCodeExpires) >= Date.now()) {
    return null;
  }
  // let digits = '0123456789';
  // let OTP = '';
  // for (let i = 0; i < 5; i++ ) {
  //     OTP += digits[Math.floor(Math.random() * 10)];
  // }
  // this.otpCode = await bcrypt.hash(OTP, 12);
  // this.otpCodeExpires = Date.now() + 2 * 60 * 1000; // this code works for 2 mins
  // return OTP;
  const testOtp = '12345';
  this.otpCode = await bcrypt.hash(testOtp, 12);
  this.otpCodeExpires = Date.now() + 2 * 60 * 1000; // this code works for 2 mins
  return testOtp;
};
userSchema.methods.compareOtpCodes = async function (
  code,
  userCode,
  codeExpires
) {
  if (Date.parse(codeExpires) < Date.now()) {
    return false;
  }
  return await bcrypt.compare(code, userCode);
};
// password operations
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  if (
    // eslint-disable-next-line operator-linebreak
    this.passwordResetExpires &&
    Date.parse(this.passwordResetExpires) >= Date.now()
  ) {
    return null;
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // this code works for 5 mins
  return resetToken;
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
