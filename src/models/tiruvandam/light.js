const mongoose = require("mongoose");
const validator = require("validator");


const lightSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true

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

const light = new mongoose.model("Light", lightSchema);
module.exports = light;