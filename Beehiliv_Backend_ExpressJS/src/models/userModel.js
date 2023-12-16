const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    userName:{
        type:String,
        required:true,
        trim:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    }
    ,
    isVerified:{
        type:Boolean,
        required:true,
        trim:true,
    },
    hives:{
        type:Object,
        required:false
    },
    phoneNumber:{
        type:Number,
        required:true
    }
},{collection:'users',timestamps:true,versionKey:false});


const user = mongoose.model("User",User);

module.exports = user;