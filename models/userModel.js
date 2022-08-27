const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
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
    required: [true, 'پر کردن فیلد شماره موبایل الزامی است'],
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
  cart: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  favorites: [
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
  otpCode: String,
  otpCodeExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  // password: {
  //   type: String,
  //   minlength: 8,
  //   select: false,
  // },
  // passwordConfirm: {
  //   type: String,
  //   validate: {
  //     // This only works on CREATE and SAVE!!!
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     message: 'رمز عبور و تکرار آن با هم مطابقت ندارند',
  //   },
  // },
  // passwordChangedAt: Date,
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

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

userSchema.methods.otpCodeIsCorrect = async function (
  code,
  userCode,
  codeExpires
) {
  if (Date.parse(codeExpires) < Date.now()) {
    return false;
  }
  return await bcrypt.compare(code, userCode);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
