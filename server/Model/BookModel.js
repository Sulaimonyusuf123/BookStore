const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
    index: true // Index for faster searches
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
    index: true // Index for faster searches
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    index: true // Added index for price filtering
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting
  }
}, {
  timestamps: true,
  // Improve performance with these options
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  // Add collection options for better performance
  collation: { locale: 'en', strength: 2 } // Case-insensitive collation
});

// Create compound index for common query patterns
BookSchema.index({ author: 1, title: 1 });
BookSchema.index({ createdAt: -1, _id: 1 }); // Optimized for pagination with sort

// Add a static method for safe queries with timeout
BookSchema.statics.safeFindWithTimeout = async function(query = {}, options = {}) {
  // Default options
  const {
    page = 1,
    limit = 10,
    select = '',
    sort = { createdAt: -1 },
    timeout = 15000
  } = options;
  
  const skip = (page - 1) * limit;
  
  try {
    return await this.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .maxTimeMS(timeout)
      .exec();
  } catch (error) {
    console.error('Book query error:', error);
    throw new Error(`Book query failed: ${error.message}`);
  }
};

// Add a more efficient method for paginated queries that avoids using skip
BookSchema.statics.efficientPaginatedFind = async function(query = {}, options = {}) {
  const {
    limit = 10,
    select = '',
    sort = { createdAt: -1 },
    lastId = null,
    lastValue = null,
    timeout = 15000
  } = options;
  
  // Build cursor-based query instead of using skip
  let cursorQuery = { ...query };
  
  // If we have a lastId and lastValue, use them for cursor-based pagination
  if (lastId && lastValue) {
    // Determine sort field (default to createdAt)
    const sortField = Object.keys(sort)[0] || 'createdAt';
    const sortDirection = sort[sortField] === -1 ? '$lt' : '$gt';
    
    // Add cursor conditions to query
    cursorQuery = {
      ...query,
      $or: [
        { [sortField]: { [sortDirection]: lastValue } },
        { 
          [sortField]: lastValue,
          _id: { [sortDirection]: lastId }
        }
      ]
    };
  }
  
  try {
    return await this.find(cursorQuery)
      .select(select)
      .sort(sort)
      .limit(limit)
      .lean()
      .maxTimeMS(timeout)
      .exec();
  } catch (error) {
    console.error('Efficient paginated query error:', error);
    throw new Error(`Efficient paginated query failed: ${error.message}`);
  }
};

// Add method for efficient count
BookSchema.statics.safeCountWithTimeout = async function(query = {}, timeout = 10000) {
  try {
    return await this.countDocuments(query).maxTimeMS(timeout).exec();
  } catch (error) {
    console.error('Count query error:', error);
    throw new Error(`Count query failed: ${error.message}`);
  }
};

module.exports = mongoose.model('Book', BookSchema);