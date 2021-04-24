const mongoose = require("mongoose");
const validator = require("validator");


const templeeSchema = new mongoose.Schema({
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

const templee = new mongoose.model("Templee", templeeSchema);
module.exports = templee;