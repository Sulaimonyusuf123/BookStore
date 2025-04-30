// BookModel.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true // Add index on title for faster searches
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
    index: true // Add index on author for faster searches
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for common query patterns if needed
BookSchema.index({ author: 1, title: 1 });

module.exports = mongoose.model('Book', BookSchema);