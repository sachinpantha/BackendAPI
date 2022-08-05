// const express = require("express");
// const fs = require("fs");
// const morgan = require("morgan");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/devdata/data.json`));
// const app = express();
// app.use(morgan('dev'))   //Gives Login Request Info///MORGAN IS A 3RD PARTY MIDDLEWARE
// app.use(express.json());
// ////SETTING UP OUR OWN MIDDLEWARE
// app.use((req, res, next) => {
//   console.log("Hello from Middleware<3"); ////GLOBAL MIDDLEWARE ABOVE ALL ROUTE HANDLERRS
//   next();
// });
// const getAllTour = (req, res) => {
//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// const SearchData = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: "Unsuccessful",
//       message: "Invalid ID",
//     });
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: "success",
//     results: tour.length,
//     data: {
//       tour,
//     },
//   });
// };

// const PostData = (req, res) => {
//   const newID = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newID }, req.body); //allows to create new object by merging into existing object
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/devdata/data.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         data: {
//           tour: newTour,
//         },
//       }); //201 stands for created
//     }
//   );
// };
// const getAllUsers=(req,res)=>{
//   res.status(500).json({
//     status: 'error',
//     message:'This route is not yet defined'
//   })
// }
// const createUser=(req,res)=>{
//   res.status(500).json({
//     status: 'error',
//     message:'This route is not yet defined'
//   })
// }
// const getUser=(req,res)=>{
//   res.status(500).json({
//     status: 'error',
//     message:'This route is not yet defined'
//   })
// }
// const updateUser=(req,res)=>{
//   res.status(500).json({
//     status: 'error',
//     message:'This route is not yet defined'
//   })
// }
// const deleteUser=(req,res)=>{
//   res.status(500).json({
//     status: 'error',
//     message:'This route is not yet defined'
//   })
// }
// //1st METHOD
// // app.get("/api/v1/tours",getAllTour );

// //Searching in JSON
// // app.get("/api/v1/tours/:id", SearchData);

// ////ERR HTTP HEADERS OCCURS WHEN YOU TRY TO SEND TWO RESPONSES

// ///////////POSTING DATA ON JSON////////////////////////////
// // app.post("/api/v1/tours", PostData);

// app.route("/api/v1/tours").get(getAllTour).post(PostData); //CHAINING METHOD
// app.route("/api/v1/tours/:id").get(SearchData); //CHAINING METHOD
// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.listen(3000, () => {
//   console.log("Server started running on port 3000");
// });

//Organizing The Files

const express = require("express");

//IMPORTING ROUTERS
const tourRouter = require("./router/tourRoutes");
const userRouter = require("./router/userRoutes");
const morgan = require("morgan");
const app = express();
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {   //EKCHOTI CONFIG LIYESI SABAILAI KAAM GARXA
  app.use(morgan("dev")); //Gives Login Request Info///MORGAN IS A 3RD PARTY MIDDLEWARE
}
app.use(express.json());
app.use(express.static("public")); ///Serving static files
////SETTING UP OUR OWN MIDDLEWARE
// app.use((req, res, next) => {
//   console.log("Hello from Middleware<3"); ////GLOBAL MIDDLEWARE ABOVE ALL ROUTE HANDLERRS
//   next();
// });
//1st METHOD
// app.get("/api/v1/tours",getAllTour );

//Searching in JSON
// app.get("/api/v1/tours/:id", SearchData);

////ERR HTTP HEADERS OCCURS WHEN YOU TRY TO SEND TWO RESPONSES

///////////POSTING DATA ON JSON////////////////////////////
// app.post("/api/v1/tours", PostData);

// const tourRouter=express.Router();
// const userRouter= express.Router();
// app.use('/api/v1/tours',tourRouter);
// app.use('/api/v1/users',userRouter);
// tourRouter.route("/").get(getAllTour).post(PostData); //CHAINING METHOD   //TOUR ROUTER RUNS FOR API/V1/TOURS
// tourRouter.route("/:id").get(SearchData); //CHAINING METHOD

// //USERS
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// app.listen(3000, () => {
//   console.log("Server started running on port 3000");
// });

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//USERS
// app.listen(3000, () => {
//   console.log("Server started running on port 3000");
// });
module.exports = app;
