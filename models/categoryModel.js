const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'پر کردن فیلد نام دسته بندی الزامی است'],
    trim: true,
  },
  SubCategories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
  ],
  slug: String,
  icon: String,
});

categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { replacement: '_', lower: true });
  next();
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
