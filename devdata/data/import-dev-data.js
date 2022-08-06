const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config({ path: './../../config.env' }); //Specify the path of env
const Tour = require('./../../models/tourModel');
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections)   //To see connection status and its data in console
    console.log("DB connection succesful");
  });
//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'))
//IMPORTING DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully loaded')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

//DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}
console.log(process.argv)
if (process.argv[2]==='--import') {
  importData()
}else if (process.argv[2]==='--delete') {
  deleteData();
}