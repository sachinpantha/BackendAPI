const mongoose=require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); //Specify the path of env
const app = require("./app");
const Tour= require('./models/tourModel')
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections)   //To see connection status and its data in console
    console.log("DB connection succesful");
  });
const testTour= new Tour({
  name: "Github GIST",   //Creating document using constructor
  rating: 4.2,
  price: 497
})
testTour.save().then(doc=>{
  console.log(doc)   //This returns the actual document saved in database
}).catch(err=>{
  console.log(err)
})
// console.log(app.get('env'));   //Shows environment we're working in
// console.log(process.env.PROCESSOR_REVISION);   //Install dotenv package
// console.log(process.env);
app.listen(process.env.PORT, () => {
  console.log("Server started running on port 3000");
});
