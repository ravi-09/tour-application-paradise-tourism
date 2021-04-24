const jwt = require("jsonwebtoken");
const Register = require("../models/signup");

const auth = async(req, res, next) => {

    try {

        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.AUTH_KEY);
        const user = await Register.findOne({ _id: verifyUser._id })
        req.token = token;
        req.user = user;
        next();

    } catch (error) {

        res.status(401).render("login");
    }



}

module.exports = auth;