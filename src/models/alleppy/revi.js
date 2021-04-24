const mongoose = require("mongoose");
const validator = require("validator");


const reviSchema = new mongoose.Schema({
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

const revi = new mongoose.model("Revi", reviSchema);
module.exports = revi;