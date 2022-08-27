const mongoose = require('mongoose');
// const User = require('./userModel');
// const slugify = require('slugify');
const persianSlugify = require('../utils/persianSlugify');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'نام منبع نمیتواند خالی باشد'],
      trim: true,
    },
    slug: String,
    logo: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

resourceSchema.pre('save', function (next) {
  this.slug = persianSlugify(this.name);
  next();
});

const resourceModel = mongoose.model('Resource', resourceSchema);

module.exports = resourceModel;
