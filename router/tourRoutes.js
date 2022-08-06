//FOR LOCALFILESYSTEM

// const express=require('express');
// const tourController=require('../controllers/tourController')  //We can destucture it too in different functions that reduces exports
// const router=express.Router();
// // router.param('id',(req,res,next,val)=>{    //PARAM MIDDLEWARE  ONLY RUB FOR TOURROUTES
// //     console.log(` Tour id is ${val}`)
// //     next();
// // })

// router.param('id',tourController.checkID)
// router.route("/").get(tourController.getAllTour).post(tourController.checkBody,tourController.PostData); //CHAINING METHOD   //TOUR ROUTER RUNS FOR API/V1/TOURS
// router.route("/:id").get(tourController.SearchData); //CHAINING METHOD
// module.exports=router;


//FOR DATABASES

const express = require('express');
const tourController = require('../controllers/tourController')
const router = express.Router();
router.route('/top-5-cheap').get( tourController.aliasTopTours, tourController.getAllTour); //ALIASING AND PUTTING QUERIES IN ROUTES AND CONTROLLERS
router.route('/tour-stats').get(tourController.getTourStats)
router.route("/")
.get(tourController.getAllTour)
.post(tourController.PostData);

router.route("/:id")
.get(tourController.SearchData)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);
module.exports = router;