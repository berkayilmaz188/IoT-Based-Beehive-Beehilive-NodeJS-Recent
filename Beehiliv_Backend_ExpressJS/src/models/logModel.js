const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Log = new Schema({
    data:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        required:true,
        trim:true,
    }
},{collection:'logs',timestamps:true});


const log = mongoose.model("Log",Log);

module.exports = log;