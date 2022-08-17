const mongoose = require('mongoose');
const validator = require('validator');  //VALIDATOR PACKAGE
const bcrypt=require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us  your name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters'],
        minlength: [10, 'A user name must have more or equal then 10 characters']
    },
    email: {
        type: String,
        required: ['true', 'Please provide your email'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'Please provide valid email']
    },
    photo:String,
    password:{
        type:String,
        required: [true, 'Please Provide a password'],
        minlength: 8,
    },
    passwordConfirm:{
        type:String,
        required: [true, 'Please confirm your password'],
        validate:{
            //This only works on create and save!!!
            validator: function(el){   //Arrrow function doesnt support this keyword
                return el=== this.password
            },
            message: 'Passwords are not same'
        }
    }
})
//Encryption
//Only run if it was modified
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12)
    //Deletes pcs
    this.passwordConfirm=undefined;
    next();
})
const User = mongoose.model('User',userSchema);
module.exports=User;