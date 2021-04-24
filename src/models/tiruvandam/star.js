const mongoose = require("mongoose");
const validator = require("validator");


const starSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    rating: {
        type: Number,


    },
    email: {
        type: String,
        required: true
    },
    feedback: {
        type: String,


    },


    date: {
        type: Date,
        default: Date.now
    }


});

const star = new mongoose.model("Star", starSchema);
module.exports = star;