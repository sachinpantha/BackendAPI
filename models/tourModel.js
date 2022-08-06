const mongoose = require('mongoose');
const toursSchema = new mongoose.Schema({ //Schema type options for more valdation
  name: {
    type: String,
    required: [true, 'A tour name must be specified'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour price must be specified']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,     //This will remove white spaces from beginning and the end of string
    required: [true, 'A tour must have description']
  },
  imageCover:{
    type: String,
    required: ['true', 'A tour must have cover image']
  },
  images: [String],
  createdAt:{
    type: Date,
    default: Date.now(),
    select: false   //Not displaying in api via schema
  },
  startDates: [Date],
  description:{
    type: String,
    trim: true
  }
});
const Tour = mongoose.model('Tour', toursSchema)
module.exports = Tour;