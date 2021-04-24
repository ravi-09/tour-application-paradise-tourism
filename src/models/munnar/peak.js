const mongoose = require("mongoose");
const validator = require("validator");


const peakSchema = new mongoose.Schema({
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

const peak = new mongoose.model("Peak", peakSchema);
module.exports = peak;