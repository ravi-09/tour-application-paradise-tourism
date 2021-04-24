const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validate = require("validator")

const signupSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: Number,

    },
    age: Number,
    gender: String,
    state: String,
    city: String,
    password: String,
    cpassword: String,
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

signupSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "gateryudajkliroehulagyuedbcnzuytuianskkljbsbkds");
        this.tokens = this.tokens.concat({ token: token });
        //console.log(token);
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }

}

signupSchema.pre("save", async function(next) {
    if (this.isModified("password")) { //change password

        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword = await bcrypt.hash(this.password, 10);
    }
    next(); //important to type next
});
// signupSchema.pre('findOneAndUpdate', async function() {
//     this.password = await bcrypt.hash(this.password, 10);
//     this.cpassword = await bcrypt.hash(this.password, 10);
// })



const register = new mongoose.model("Account", signupSchema);
module.exports = register;