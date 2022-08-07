const mongoose = require('mongoose');
const slugify = require('slugify');
const validator=require('validator');  //VALIDATOR PACKAGE
const toursSchema = new mongoose.Schema({ //Schema type options for more valdation
  name: {
    type: String,
    required: [true, 'A tour name must be specified'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters']   //VALIDATION {FAT MODEL-THIN CONTROLLER} 
    // validate:[ validator.isAlpha, 'Tour name must only characters'] //Validator package
  },
  slug: String,
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
    required: [true, 'A tour must have difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficulty'],
      message: 'Difficulty is either easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour price must be specified']
  },
  priceDiscount: {
    type: Number,
    validate:{
      validator:function (val) {
        //THIS ONLY POINTS TO CURRENT DOC ON NEW DOCUMENT CREATION
        return val < this.price;
      },
      message:'Discount price {{VALUE}} must be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true,     //This will remove white spaces from beginning and the end of string
    required: [true, 'A tour must have description']
  },
  imageCover: {
    type: String,
    required: ['true', 'A tour must have cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false   //Not displaying in api via schema
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
toursSchema.virtual('durationWeeks').get(function () {  //SHOWS IN DOCUMENT BUT NOT STORE IN DATABASE
  return this.duration / 7;
})

//THIS IS DOCUMENT MIDDLEWARE BEFORE .save() and .delete() command
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})
// toursSchema.pre('save',function(next){
//   console.log('WILL SAVE DOCUMENT!!')
//   next();
// })
// toursSchema.post('save',function(doc,next){
//   console.log(doc);
//   next();
// })

//QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {  //REGEX FOR FIND
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now();
  next();
})
toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`)
  next();
})

//AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  console.log(this.pipeline())
  next();
})
const Tour = mongoose.model('Tour', toursSchema)
module.exports = Tour;