const mongoose = require("mongoose");
const validator = require("validator");


const napierSchema = new mongoose.Schema({
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
        required: true,
    },

    date: {
        type: Date,
        default: Date.now
    }


});

const napier = new mongoose.model("Napier", napierSchema);
module.exports = napier;