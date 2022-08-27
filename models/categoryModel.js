const mongoose = require('mongoose');
const persianSlugify = require('../utils/persianSlugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'پر کردن فیلد نام دسته بندی الزامی است'],
    trim: true,
  },
  slug: String,
  imageCover: String,
});

categorySchema.pre('save', function (next) {
  this.slug = persianSlugify(this.name);
  next();
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
