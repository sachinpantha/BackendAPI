// const fs = require("fs");
// const Tour = require("./../models/tourModel");
// // const tours = JSON.parse(fs.readFileSync(`${__dirname}/../devdata/data.json`));  //This was for testing purpose ie Local database
// exports.checkID = (req, res, next, val) => {
//   //This evades the repetition of code by checking ID Globally
//   console.log(`The value is ${val}`);
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: "Unsuccessful",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (req.body.name && req.body.price) {
//     next();
//   } else {
//     res.status(404).json({
//       status: "fail",
//       message: "No Data given",
//     });
//   }
// };
// exports.getAllTour = (req, res) => {
//   res.status(200).json({
//     status: "success",
//     // results: tours.length,
//     // data: {
//     //   tours,
//     // },
//   });
// };

// exports.SearchData = (req, res) => {
//   const id = req.params.id * 1;
//   // const tour = tours.find((el) => el.id === id);
//   // res.status(200).json({
//   //   status: "success",
//   //   results: tour.length,
//   //   data: {
//   //     tour,
//   //   },
//   // });
// };

// exports.PostData = (req, res) => {
//   // const newID = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newID }, req.body); //allows to create new object by merging into existing object
//   // tours.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/devdata/data.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     res.status(201).json({    Commenting because now we import from database
//   //       status: "success",
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     });

//   //     //201 stands for created
//   //   }
//   // );
//   res.status(201).json({
//     status: "success",
//     data: {
//       tour: newTour,
//     },
//   });
// };

//FOR DATABASE
const { exists } = require("./../models/tourModel");
const Tour = require("./../models/tourModel");
const APIfeatures = require('../utils/apiFeatures')
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';   //PREFILLING THE QUERIES
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}
exports.getAllTour = async (req, res) => {
  try {
    // const queryObj = { ...req.query }
    // const excludedFields = ['page', 'limit', 'fields']
    // excludedFields.forEach(el => delete queryObj[el])
    // // console.log(req.query, queryObj)    //It logs out the parameters in the query
    // // const tours = await Tour.find(req.query);
    // //ADVANCED FILITERING AND PUTTING $ SIGN
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)  // REGEX TO FIND EXACT WORDS
    // // const query= Tour.find(queryObj);
    // let query = Tour.find(JSON.parse(queryStr));

    //SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ')
    //   // query = query.sort(req.query.sort)
    //   query = query.sort(sortBy)
    // } else {
    //   query = query.sort('-createdAt')
    // }

    //LIMITING FIELDS
    // if (req.query.fields) {
    //   let fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields)
    // }
    // else {
    //   query = query.select('-__v')
    // }

    //Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();  //COUNTS TOTAL NUMBER OF PAGE IN DOCUMENT
    //   if (skip >= numTours) {
    //     throw new err('This page does not exists')
    //   }
    // }
    //EXECUTING QUERYS
    const features = new APIfeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();

    const tours = await features.query;
    // const tours = await query;
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy') //QUERY WRITTEN USING SPECIAL MONGOOSE METHODS
    res.status(200).json({
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.SearchData = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: fail,
      message: err,
    });
  }
};

exports.PostData = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: fail,
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
}
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
//Aggregation pipeline
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {   //FOR AIRTHMETIC CALCULATIONS
          _id: { $toUpper: '$difficulty' },  //Filtering with difficulty
          numTours: { $sum: 1 },  //Adding 1 while looping out through each document
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },  //FieldName
          maxPrice: { $max: '$price' },
        }
      },
      {
        $sort: { avgPrice: 1 }
      } //MATCHING CAN BE REPEATED
      // {
      //   $match: {_id: {$ne: 'EASY'}}  //EXCLUDING DOCUMENTS WITH ID AS EASY
      // }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year= req.params.year*1;
    const plan= await Tour.aggregate([
      {
        $unwind: '$startDates'   //Yo field maa bhako sappai jati ota object cha teti ota unique document return gardincha
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),  //MATCHING START DATES
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'},
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'}  //Pushing into tours array
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project:{
          _id:0      //HIDES THE FIELD WHEN SET TO ZERO
        }
      }
      ,{
        $sort:{ numTourStarts: -1}   //SORT WITH HIGHEST/BUSIEST MONTH IN THE DOCUMENT(TESTED VIA POSTMAN)
      },
      {
        $limit: 12   //LIMITING THE NUMBER OF DOCUMENTS
      }
    ])
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}