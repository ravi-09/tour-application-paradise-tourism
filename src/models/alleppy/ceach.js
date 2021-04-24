const mongoose = require("mongoose");
const validator = require("validator");


const ceachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    rating: {
        type: Number,
       

    },
    email:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true,
    },

    date: {
        type: Date,
        default: Date.now
    }


});

const ceach = new mongoose.model("Ceach", ceachSchema);
module.exports = ceach;