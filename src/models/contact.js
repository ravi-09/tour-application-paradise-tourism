const mongoose = require("mongoose");
const validator = require("validator");

const contactusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        validite(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid Email");
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        minlength: 10,
        unique: true
    },
    message: {
        type: String,
        required: true,

    },
    date: {
        type: Date,
        default: Date.now
    }


});
const contactus = new mongoose.model("Contactus", contactusSchema);
module.exports = contactus;