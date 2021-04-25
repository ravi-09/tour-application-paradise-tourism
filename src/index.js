require('dotenv').config();
const express = require("express");
const app = express();
require("./db/conn");
const contact = require("./models/contact");
const Register = require("./models/signup");
const auth = require("./middleware/auth");
const star = require("./models/tiruvandam/star");
const tirumesuem = require("./models/tiruvandam/napier");
const tiruzoo = require("./models/tiruvandam/zoo");
const tirubeach = require("./models/tiruvandam/beach");
const tirulight = require("./models/tiruvandam/light");
const tirulatin = require("./models/tiruvandam/latin");
const kochipara = require("./models/kochi/para");
const kochiisland = require("./models/kochi/island");
const kochibird = require("./models/kochi/bird");
const kochibeach = require("./models/kochi/veach");
const kochichurch = require("./models/kochi/church");
const kochitemp = require("./models/kochi/temp");
const alalake = require("./models/alleppy/lake");
const alabeach = require("./models/alleppy/ceach");
const alaisland = require("./models/alleppy/uland");
const alarevi = require("./models/alleppy/revi");
const alachurch = require("./models/alleppy/hurch");
const alatemple = require("./models/alleppy/emple");
const munnarpark = require("./models/munnar/park");
const munnardam = require("./models/munnar/dam");
const munnartea = require("./models/munnar/tea");
const munnarana = require("./models/munnar/ana");
const munnarwater = require("./models/munnar/water");
const munnarpeak = require("./models/munnar/peak");
const wayanadwild = require("./models/wayanad/wild");
const wayanadcave = require("./models/wayanad/cave");
const wayanadkuru = require("./models/wayanad/kuru");
const wayanadlake = require("./models/wayanad/fake");
const wayanadtemple = require("./models/wayanad/templee");
const wayanadwaterfalls = require("./models/wayanad/kant");
const path = require("path");

const bcrypt = require("bcryptjs");
const hbs = require('hbs');
const bodyParser = require("body-parser");
const translate = require('@vitalets/google-translate-api');
const cookieParser = require("cookie-parser");






const port = process.env.PORT || 9000;
const StaticPath = path.join(__dirname, "../public");

const template_path = path.join(__dirname, "../templates/views");
app.set("view engine", 'hbs');
app.use(express.static(StaticPath));
app.set('views', template_path);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res) => {
    res.render('login');
});
app.post("/", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email }); //getting email from database
        const isMatch = await bcrypt.compare(password, useremail.password);
        const username = useremail.name;
        const token = await useremail.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 300000000000000000000000000000),
            httpOnly: true, //means now the client don't do anything from our cookie.
        });
        if (isMatch) {
            res.status(201).render("index", { name: username });
        } else {
            res.status(400).render("login", { errmsg: "Invalid login details" });
        }
    } catch (err) {

        res.status(400).render("login", { errmsg: "Invalid login details" });
    }

});
app.get("/signup", (req, res) => {
    res.render("signup");
});


app.post("/signup", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {
            const empResitration = new Register({
                name: req.body.name,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                state: req.body.state,
                city: req.body.city,
                password: password,
                cpassword: cpassword

            });
            const token = await empResitration.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 300000000000000000000000000000),
                httpOnly: true //means now the client don't do anything from our cookie.
            });

            const registeredData = await empResitration.save();
            res.status(201).render("login");
        } else {
            res.render("signup", { errormsg: "Password isn't match" });
        }

    } catch (err) {
        //console.log(err);
        res.status(400).render("signup", { emailvalid: "Account already available with given email " })
    }
});
app.get("/logout", auth, async(req, res) => {
    try {

        req.user.tokens = [];


        await req.user.save();

        res.clearCookie("jwt");

        res.render("login");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
app.get("/reset", (req, res) => {
    res.render("reset");
});
app.post("/reset", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const useremail = await Register.findOne({ email: email });
        if (useremail) {
            if (password === cpassword) {
                const salt = await bcrypt.genSalt(10);
                const npassword = await bcrypt.hash(password, salt);
                const ncpassword = await bcrypt.hash(cpassword, salt);
                const doc = await Register.findOneAndUpdate({ email: email }, { $set: { password: npassword, cpassword: ncpassword } }, { new: true });
                // const saveUpdate = await doc.save();
                res.render("login");
            } else {
                res.render("reset", { errormsg: "password does't match" });
            }

        } else {
            res.render("reset", { errormsg: "email does't exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

});

app.get("/home", auth, async(req, res) => {

    username = req.user.name;

    res.render("index", { name: username });
});




app.get("/about", auth, (req, res) => {
    username = req.user.name;

    res.render("about", { name: username });
});
app.get("/car_rent", (req, res) => {


    res.render("car_rent");
});
app.get('/translator', auth, (req, res) => {
    username = req.user.name;
    res.render('translator', { title: "english to malyalam", translated: "", name: username })
});
app.post('/translator', auth, (req, res) => {
    username = req.user.name;


    translate(req.body.speech, { to: req.body.language }).then(response => {
        res.render('translator', { title: "english to malyalam", translated: response.text, name: username })
    }).catch(err => {
        console.error(err);
    });

});
app.get("/contact", auth, (req, res) => {
    username = req.user.name;

    res.render("contact", { name: username });
});
app.post("/contact", auth, async(req, res) => {
    try {
        username = req.user.name;
        const contactUsPage = new contact({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message
        });

        const contactusData = await contactUsPage.save();

        res.status(201).render("contact", { name: username });




    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
app.get("/triu", auth, async(req, res) => {
    try {
        const stardoc = await star.countDocuments();
        const staravg = await star.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const napierdoc = await tirumesuem.countDocuments();
        const napieravg = await tirumesuem.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const napieravgrate = await napieravg[0].avgrate;
        const napierroundof = await Math.round(napieravgrate * 10) / 10;



        const zoodoc = await tiruzoo.countDocuments();
        const zooavg = await tiruzoo.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const zooavgRate = await zooavg[0].avgrate;
        const zooroundof = await Math.round(zooavgRate * 10) / 10;

        const beachdoc = await tirubeach.countDocuments();
        const beachavg = await tirubeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const beachavgRate = await beachavg[0].avgrate;
        const beachroundof = await Math.round(beachavgRate * 10) / 10;

        const lightdoc = await tirulight.countDocuments();
        const lightavg = await tirulight.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const lightavgRate = await lightavg[0].avgrate;
        const lightroundof = await Math.round(lightavgRate * 10) / 10;

        const latindoc = await tirulatin.countDocuments();
        const latinavg = await tirulatin.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const latinavgRate = await latinavg[0].avgrate;
        const latinroundof = await Math.round(latinavgRate * 10) / 10;

        res.render("triu", {
            persons: stardoc,
            avgreview: roundof,
            zoopersons: zoodoc,
            zooavgreview: zooroundof,
            beachpersons: beachdoc,
            beachavgreview: beachroundof,
            lightpersons: lightdoc,
            lightavgreview: lightroundof,
            latinpersons: latindoc,
            latinavgreview: latinroundof,
            napierpersons: napierdoc,
            napierreview: napierroundof,
        });

    } catch (err) {
        console.log(err);
    }
});

app.get("/kochi", auth, async(req, res) => {
    const stardoc = await kochipara.countDocuments();
    const staravg = await kochipara.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const zoodoc = await kochiisland.countDocuments();
    const zooavg = await kochiisland.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const zooavgRate = await zooavg[0].avgrate;
    const zooroundof = await Math.round(zooavgRate * 10) / 10;

    const beachdoc = await kochibird.countDocuments();
    const beachavg = await kochibird.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const beachavgRate = await beachavg[0].avgrate;
    const beachroundof = await Math.round(beachavgRate * 10) / 10;

    const lightdoc = await kochibeach.countDocuments();
    const lightavg = await kochibeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const lightavgRate = await lightavg[0].avgrate;
    const lightroundof = await Math.round(lightavgRate * 10) / 10;

    const latindoc = await kochichurch.countDocuments();
    const latinavg = await kochichurch.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const latinavgRate = await latinavg[0].avgrate;
    const latinroundof = await Math.round(latinavgRate * 10) / 10;

    const tempdoc = await kochitemp.countDocuments();
    const tempavg = await kochitemp.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const tempavgRate = await tempavg[0].avgrate;
    const temproundof = await Math.round(tempavgRate * 10) / 10;

    res.render("kochi", {
        persons: stardoc,
        avgreview: roundof,
        zoopersons: zoodoc,
        zooavgreview: zooroundof,
        beachpersons: beachdoc,
        beachavgreview: beachroundof,
        lightpersons: lightdoc,
        lightavgreview: lightroundof,
        latinpersons: latindoc,
        latinavgreview: latinroundof,
        temppersons: tempdoc,
        tempavgreview: temproundof
    });
});
app.get("/alleppey", auth, async(req, res) => {
    const stardoc = await alalake.countDocuments();
    const staravg = await alalake.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const zoodoc = await alabeach.countDocuments();
    const zooavg = await alabeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const zooavgRate = await zooavg[0].avgrate;
    const zooroundof = await Math.round(zooavgRate * 10) / 10;

    const beachdoc = await alaisland.countDocuments();
    const beachavg = await alaisland.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const beachavgRate = await beachavg[0].avgrate;
    const beachroundof = await Math.round(beachavgRate * 10) / 10;

    const lightdoc = await alarevi.countDocuments();
    const lightavg = await alarevi.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const lightavgRate = await lightavg[0].avgrate;
    const lightroundof = await Math.round(lightavgRate * 10) / 10;

    const latindoc = await alachurch.countDocuments();
    const latinavg = await kochichurch.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const latinavgRate = await latinavg[0].avgrate;
    const latinroundof = await Math.round(latinavgRate * 10) / 10;


    const tempdoc = await alatemple.countDocuments();
    const tempavg = await alatemple.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const tempavgRate = await tempavg[0].avgrate;
    const temproundof = await Math.round(tempavgRate * 10) / 10;

    res.render("alleppey", {
        persons: stardoc,
        avgreview: roundof,
        zoopersons: zoodoc,
        zooavgreview: zooroundof,
        beachpersons: beachdoc,
        beachavgreview: beachroundof,
        lightpersons: lightdoc,
        lightavgreview: lightroundof,
        latinpersons: latindoc,
        latinavgreview: latinroundof,
        temppersons: tempdoc,
        tempavgreview: temproundof
    });


});
app.get("/munnar", auth, async(req, res) => {
    const stardoc = await munnarpark.countDocuments();
    const staravg = await munnarpark.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const zoodoc = await munnardam.countDocuments();
    const zooavg = await munnardam.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const zooavgRate = await zooavg[0].avgrate;
    const zooroundof = await Math.round(zooavgRate * 10) / 10;

    const beachdoc = await munnartea.countDocuments();
    const beachavg = await munnartea.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const beachavgRate = await beachavg[0].avgrate;
    const beachroundof = await Math.round(beachavgRate * 10) / 10;

    const lightdoc = await munnarana.countDocuments();
    const lightavg = await munnarana.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const lightavgRate = await lightavg[0].avgrate;
    const lightroundof = await Math.round(lightavgRate * 10) / 10;

    const latindoc = await munnarwater.countDocuments();
    const latinavg = await munnarwater.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const latinavgRate = await latinavg[0].avgrate;
    const latinroundof = await Math.round(latinavgRate * 10) / 10;



    const tempdoc = await munnarpeak.countDocuments();
    const tempavg = await munnarpeak.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const tempavgRate = await tempavg[0].avgrate;
    const temproundof = await Math.round(tempavgRate * 10) / 10;

    res.render("munnar", {
        persons: stardoc,
        avgreview: roundof,
        zoopersons: zoodoc,
        zooavgreview: zooroundof,
        beachpersons: beachdoc,
        beachavgreview: beachroundof,
        lightpersons: lightdoc,
        lightavgreview: lightroundof,
        latinpersons: latindoc,
        latinavgreview: latinroundof,
        temppersons: tempdoc,
        tempavgreview: temproundof
    });


});

app.get("/wayanad", auth, async(req, res) => {
    const stardoc = await wayanadwild.countDocuments();
    const staravg = await wayanadwild.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const zoodoc = await wayanadcave.countDocuments();
    const zooavg = await wayanadcave.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const zooavgRate = await zooavg[0].avgrate;
    const zooroundof = await Math.round(zooavgRate * 10) / 10;

    const beachdoc = await wayanadkuru.countDocuments();
    const beachavg = await wayanadkuru.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const beachavgRate = await beachavg[0].avgrate;
    const beachroundof = await Math.round(beachavgRate * 10) / 10;

    const lightdoc = await wayanadlake.countDocuments();
    const lightavg = await wayanadlake.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const lightavgRate = await lightavg[0].avgrate;
    const lightroundof = await Math.round(lightavgRate * 10) / 10;

    const latindoc = await wayanadtemple.countDocuments();
    const latinavg = await wayanadtemple.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const latinavgRate = await latinavg[0].avgrate;
    const latinroundof = await Math.round(latinavgRate * 10) / 10;



    const tempdoc = await wayanadwaterfalls.countDocuments();
    const tempavg = await wayanadwaterfalls.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const tempavgRate = await tempavg[0].avgrate;
    const temproundof = await Math.round(tempavgRate * 10) / 10;

    res.render("wayanad", {
        persons: stardoc,
        avgreview: roundof,
        zoopersons: zoodoc,
        zooavgreview: zooroundof,
        beachpersons: beachdoc,
        beachavgreview: beachroundof,
        lightpersons: lightdoc,
        lightavgreview: lightroundof,
        latinpersons: latindoc,
        latinavgreview: latinroundof,
        temppersons: tempdoc,
        tempavgreview: temproundof
    });


});

app.get("/packages", auth, (req, res) => {
    const username = req.user.name;
    res.render("packages.hbs", { name: username });
});


app.post("/padma", auth, async(req, res) => {
    try {

        const starPage = new star({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });

        const stardoc = await star.countDocuments() + 1;
        const starData = await starPage.save();
        const staravg = await star.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);

        const getStarData = star.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            res.status(201).render("padma", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/padma", auth, async(req, res, next) => {
    const stardoc = await star.countDocuments();
    const staravg = await star.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;



    const getStarData = star.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        res.render("padma", { records: data, persons: stardoc, avgreview: roundof });
    });

});
app.get("/tirumesuem", auth, async(req, res) => {
    const stardoc = await tirumesuem.countDocuments();
    const staravg = await tirumesuem.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;



    const getStarData = tirumesuem.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        res.render("tirumesuem", { records: data, persons: stardoc, avgreview: roundof });
    });


});
app.post("/tirumesuem", auth, async(req, res) => {
    try {
        const napierPage = new tirumesuem({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await napierPage.save();


        const stardoc = await tirumesuem.countDocuments();
        const staravg = await tirumesuem.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = tirumesuem.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("tirumesuem", { records: data, avgreview: roundof, persons: stardoc });
        });

    } catch (err) {

        res.status(500).send(err);
    }
});
app.get("/tiruzoo", auth, async(req, res) => {

    const stardoc = await tiruzoo.countDocuments();
    const staravg = await tiruzoo.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;
    //console.log(roundof);

    const getStarData = tiruzoo.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("tiruzoo", { records: data, avgreview: roundof, persons: stardoc });
    });


});
app.post("/tiruzoo", auth, async(req, res) => {

    try {
        const zooPage = new tiruzoo({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await zooPage.save();

        const stardoc = await tiruzoo.countDocuments();
        const staravg = await tiruzoo.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = tiruzoo.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("tiruzoo", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/tirubeach", auth, async(req, res) => {

    const stardoc = await tirubeach.countDocuments();
    const staravg = await tirubeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = tirubeach.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("tirubeach", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/tirubeach", async(req, res) => {

    try {
        const beachPage = new tirubeach({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await beachPage.save();

        const stardoc = await tirubeach.countDocuments();
        const staravg = await tirubeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);

        const getStarData = tirubeach.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("tirubeach", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
    //res.render("tirubeach");
});
app.get("/tirulight", auth, async(req, res) => {

    const stardoc = await tirulight.countDocuments();
    const staravg = await tirulight.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;
    //console.log(roundof);

    const getStarData = tirulight.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("tirulight", { records: data, avgreview: roundof, persons: stardoc });
    });


});
app.post("/tirulight", auth, async(req, res) => {

    try {
        const lightPage = new tirulight({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await lightPage.save();

        const stardoc = await tirulight.countDocuments();
        const staravg = await tirulight.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = tirulight.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("tirulight", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
    //res.render("tirulight");
});
app.get("/tirulatin", auth, async(req, res) => {

    const stardoc = await tirulatin.countDocuments();
    const staravg = await tirulatin.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = tirulatin.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("tirulatin", { records: data, avgreview: roundof, persons: stardoc });
    });


});
app.post("/tirulatin", auth, async(req, res) => {

    try {
        const latinPage = new tirulatin({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await latinPage.save();

        const stardoc = await tirulatin.countDocuments();
        const staravg = await tirulatin.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);

        const getStarData = tirulatin.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("tirulatin", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/kochipara", auth, async(req, res) => {

    const stardoc = await kochipara.countDocuments();
    const staravg = await kochipara.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = kochipara.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("kochipara", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/kochipara", auth, async(req, res) => {

    try {
        const paraPage = new kochipara({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await paraPage.save();

        const stardoc = await kochipara.countDocuments();
        const staravg = await kochipara.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = kochipara.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("kochipara", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/kochiisland", auth, async(req, res) => {

    const stardoc = await kochiisland.countDocuments();
    const staravg = await kochiisland.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = kochiisland.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("kochiisland", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/kochiisland", auth, async(req, res) => {

    try {
        const islandPage = new kochiisland({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await islandPage.save();

        const stardoc = await kochiisland.countDocuments();
        const staravg = await kochiisland.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);

        const getStarData = kochiisland.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("kochiisland", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/kochibird", auth, async(req, res) => {

    const stardoc = await kochibird.countDocuments();
    const staravg = await kochibird.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = kochibird.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("kochibird", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/kochibird", auth, async(req, res) => {

    try {
        const birdPage = new kochibird({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await birdPage.save();

        const stardoc = await kochibird.countDocuments();
        const staravg = await kochibird.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);

        const getStarData = kochibird.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("kochibird", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/kochibeach", auth, async(req, res) => {
    const stardoc = await kochibeach.countDocuments();
    const staravg = await kochibeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = kochibeach.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("kochibeach", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/kochibeach", auth, async(req, res) => {

    try {
        const veachPage = new kochibeach({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await veachPage.save();

        const stardoc = await kochibeach.countDocuments();
        const staravg = await kochibeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = kochibeach.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("kochibeach", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/kochichurch", auth, async(req, res) => {
    const stardoc = await kochichurch.countDocuments();
    const staravg = await kochichurch.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = kochichurch.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("kochichurch", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/kochichurch", auth, async(req, res) => {

    try {
        const churchPage = new kochichurch({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await churchPage.save();

        const stardoc = await kochichurch.countDocuments();
        const staravg = await kochichurch.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = kochichurch.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("kochichurch", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/kochitemp", auth, async(req, res) => {

    const stardoc = await kochitemp.countDocuments();
    const staravg = await kochitemp.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = kochitemp.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("kochitemp", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/kochitemp", auth, async(req, res) => {

    try {
        const tempPage = new kochitemp({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await tempPage.save();

        const stardoc = await kochitemp.countDocuments();
        const staravg = await kochitemp.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = kochitemp.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("kochitemp", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/alalake", auth, async(req, res) => {

    const stardoc = await alalake.countDocuments();
    const staravg = await alalake.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = alalake.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("alalake", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/alalake", auth, async(req, res) => {

    try {
        const lakePage = new alalake({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await lakePage.save();

        const stardoc = await alalake.countDocuments();
        const staravg = await alalake.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = alalake.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("alalake", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/alabeach", auth, async(req, res) => {

    const stardoc = await alabeach.countDocuments();
    const staravg = await alabeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = alabeach.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("alabeach", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/alabeach", auth, async(req, res) => {

    try {
        const ceachPage = new alabeach({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await ceachPage.save();

        const stardoc = await alabeach.countDocuments();
        const staravg = await alabeach.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = alabeach.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("alabeach", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/alaisland", auth, async(req, res) => {

    const stardoc = await alaisland.countDocuments();
    const staravg = await alaisland.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = alaisland.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("alaisland", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/alaisland", auth, async(req, res) => {

    try {
        const ulandPage = new alaisland({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await ulandPage.save();

        const stardoc = await alaisland.countDocuments();
        const staravg = await alaisland.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = alaisland.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("alaisland", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/alarevi", auth, async(req, res) => {

    const stardoc = await alarevi.countDocuments();
    const staravg = await alarevi.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = alarevi.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("alarevi", { records: data, avgreview: roundof, persons: stardoc });
    });
});
app.post("/alarevi", auth, async(req, res) => {

    try {
        const reviPage = new alarevi({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await reviPage.save();

        const stardoc = await alarevi.countDocuments();
        const staravg = await alarevi.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);
        const getStarData = alarevi.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("alarevi", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/alachurch", auth, async(req, res) => {

    const stardoc = await alachurch.countDocuments();
    const staravg = await alachurch.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = alachurch.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("alachurch", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/alachurch", auth, async(req, res) => {

    try {
        const hurchPage = new alachurch({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await hurchPage.save();

        const stardoc = await alachurch.countDocuments();
        const staravg = await alachurch.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = alachurch.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("alachurch", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/alatemple", auth, async(req, res) => {

    const stardoc = await alatemple.countDocuments();
    const staravg = await alatemple.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = alatemple.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("alatemple", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/alatemple", auth, async(req, res) => {

    try {
        const emplePage = new alatemple({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await emplePage.save();

        const stardoc = await alatemple.countDocuments();
        const staravg = await alatemple.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = alatemple.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("alatemple", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});
app.get("/munnarpark", auth, async(req, res) => {

    const stardoc = await munnarpark.countDocuments();
    const staravg = await munnarpark.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = munnarpark.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("munnarpark", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/munnarpark", auth, async(req, res) => {

    try {
        const parkPage = new munnarpark({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await parkPage.save();

        const stardoc = await munnarpark.countDocuments();
        const staravg = await munnarpark.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;
        //console.log(roundof);

        const getStarData = munnarpark.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("munnarpark", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/munnardam", auth, async(req, res) => {

    const stardoc = await munnardam.countDocuments();
    const staravg = await munnardam.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = munnardam.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("munnardam", { records: data, avgreview: roundof, persons: stardoc });
    });


});
app.post("/munnardam", auth, async(req, res) => {

    try {
        const damPage = new munnardam({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await damPage.save();

        const stardoc = await munnardam.countDocuments();
        const staravg = await munnardam.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = munnardam.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("munnardam", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/munnartea", auth, async(req, res) => {

    const stardoc = await munnartea.countDocuments();
    const staravg = await munnartea.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = munnartea.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("munnartea", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/munnartea", auth, async(req, res) => {

    try {
        const teaPage = new munnartea({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await teaPage.save();

        const stardoc = await munnartea.countDocuments();
        const staravg = await munnartea.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = munnartea.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("munnartea", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/munnarana", auth, async(req, res) => {

    const stardoc = await munnarana.countDocuments();
    const staravg = await munnarana.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = munnarana.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("munnarana", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/munnarana", auth, async(req, res) => {

    try {
        const anaPage = new munnarana({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await anaPage.save();

        const stardoc = await munnarana.countDocuments();
        const staravg = await munnarana.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = munnarana.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("munnarana", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/munnarwater", auth, async(req, res) => {

    const stardoc = await munnarwater.countDocuments();
    const staravg = await munnarwater.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = munnarwater.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("munnarwater", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/munnarwater", auth, async(req, res) => {

    try {
        const waterPage = new munnarwater({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await waterPage.save();

        const stardoc = await munnarwater.countDocuments();
        const staravg = await munnarwater.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = munnarwater.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("munnarwater", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/munnarpeak", auth, async(req, res) => {

    const stardoc = await munnarpeak.countDocuments();
    const staravg = await munnarpeak.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = munnarpeak.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("munnarpeak", { records: data, avgreview: roundof, persons: stardoc });
    });


});
app.post("/munnarpeak", auth, async(req, res) => {

    try {
        const peakPage = new munnarpeak({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await peakPage.save();

        const stardoc = await munnarpeak.countDocuments();
        const staravg = await munnarpeak.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;


        const getStarData = munnarpeak.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("munnarpeak", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }

});

app.get("/wayanadwild", auth, async(req, res) => {

    const stardoc = await wayanadwild.countDocuments();
    const staravg = await wayanadwild.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;


    const getStarData = wayanadwild.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("wayanadwild", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/wayanadwild", auth, async(req, res) => {

    try {
        const wildPage = new wayanadwild({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await wildPage.save();

        const stardoc = await wayanadwild.countDocuments();
        const staravg = await wayanadwild.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = wayanadwild.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("wayanadwild", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
});

app.get("/wayanadcave", auth, async(req, res) => {

    const stardoc = await wayanadcave.countDocuments();
    const staravg = await wayanadcave.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = wayanadcave.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("wayanadcave", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/wayanadcave", auth, async(req, res) => {

    try {
        const cavePage = new wayanadcave({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await cavePage.save();

        const stardoc = await wayanadcave.countDocuments();
        const staravg = await wayanadcave.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = wayanadcave.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("wayanadcave", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
});

app.get("/wayanadkuru", auth, async(req, res) => {

    const stardoc = await wayanadkuru.countDocuments();
    const staravg = await wayanadkuru.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = wayanadkuru.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("wayanadkuru", { records: data, avgreview: roundof, persons: stardoc });
    });


});
app.post("/wayanadkuru", auth, async(req, res) => {

    try {
        const kuruPage = new wayanadkuru({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await kuruPage.save();

        const stardoc = await wayanadkuru.countDocuments();
        const staravg = await wayanadkuru.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = wayanadkuru.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("wayanadkuru", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
});

app.get("/wayanadlake", auth, async(req, res) => {

    const stardoc = await wayanadlake.countDocuments();
    const staravg = await wayanadlake.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = wayanadlake.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("wayanadlake", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/wayanadlake", auth, async(req, res) => {

    try {
        const fakePage = new wayanadlake({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await fakePage.save();

        const stardoc = await wayanadlake.countDocuments();
        const staravg = await wayanadlake.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = wayanadlake.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("wayanadlake", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
});

app.get("/wayanadtemple", auth, async(req, res) => {

    const stardoc = await wayanadtemple.countDocuments();
    const staravg = await wayanadtemple.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = wayanadtemple.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("wayanadtemple", { records: data, avgreview: roundof, persons: stardoc });
    });

});
app.post("/wayanadtemple", auth, async(req, res) => {

    try {
        const templeePage = new wayanadtemple({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await templeePage.save();

        const stardoc = await wayanadtemple.countDocuments();
        const staravg = await wayanadtemple.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = wayanadtemple.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("wayanadtemple", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
});

app.get("/wayanadwaterfalls", auth, async(req, res) => {

    const stardoc = await wayanadwaterfalls.countDocuments();
    const staravg = await wayanadwaterfalls.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
    const avgRate = await staravg[0].avgrate;
    const roundof = await Math.round(avgRate * 10) / 10;

    const getStarData = wayanadwaterfalls.find({});
    getStarData.exec((err, data) => {
        if (err) throw err;
        console.log(err);
        res.status(201).render("wayanadwaterfalls", { records: data, avgreview: roundof, persons: stardoc });
    });



});
app.post("/wayanadwaterfalls", auth, async(req, res) => {

    try {
        const kantPage = new wayanadwaterfalls({
            name: req.body.name,
            rating: req.body.rating,
            email: req.body.email,
            feedback: req.body.feedback,

        });
        const starData = await kantPage.save();

        const stardoc = await wayanadwaterfalls.countDocuments();
        const staravg = await wayanadwaterfalls.aggregate([{ $group: { _id: "", avgrate: { $avg: "$rating" } } }]);
        const avgRate = await staravg[0].avgrate;
        const roundof = await Math.round(avgRate * 10) / 10;

        const getStarData = wayanadwaterfalls.find({});
        getStarData.exec((err, data) => {
            if (err) throw err;
            console.log(err);
            res.status(201).render("wayanadwaterfalls", { records: data, avgreview: roundof, persons: stardoc });
        });


    } catch {
        res.status(500).send(err);
    }
});
var Publishable_Key = process.env.PUBLISHABLE_KEY;
var Secret_Key = process.env.SECRET_KEY;
const stripe = require('stripe')(Secret_Key)
app.get("/payment", auth, (req, res) => {

    username = req.user.name;
    res.render("payment", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 100000,
                description: 'Nano car booking for a day',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/car_rent'>Go Back</a></button></div>");
        })
});
app.get("/altopayment", auth, (req, res) => {

    username = req.user.name;
    res.render("altopayment", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/altopayment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 150000,
                description: 'Alto car booking for a day',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/car_rent'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/indicapayment", auth, (req, res) => {

    username = req.user.name;
    res.render("indicapayment", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/indicapayment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 200000,
                description: 'Indica car booking for a day',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/car_rent'>Go Back</a></button></div>");

        })
});
app.get("/swiftpayment", auth, (req, res) => {

    username = req.user.name;
    res.render("swiftpayment", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/swiftpayment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 220000,
                description: 'Swift car booking for a day',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/car_rent'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/boleropayment", auth, (req, res) => {

    username = req.user.name;
    res.render("boleropayment", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/boleropayment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 260000,
                description: 'Bolero car booking for a day',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/car_rent'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/innovapayment", auth, (req, res) => {

    username = req.user.name;
    res.render("innovapayment", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/innovapayment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 300000,
                description: 'Innova car booking for a day',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/car_rent'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/budget1payment", auth, (req, res) => {

    username = req.user.name;
    res.render("budget1", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/budget1payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 999900,
                description: 'Hill & Jungle Safari Tour Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
        })
});
app.get("/budget2payment", auth, (req, res) => {

    username = req.user.name;
    res.render("budget2", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/budget2payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 399900,
                description: 'Padmanabhaswamy Temple Tour Package Booking ',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/budget3payment", auth, (req, res) => {

    username = req.user.name;
    res.render("budget3", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/budget3payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 1199900,
                description: 'Beach Wonders Package Booking ',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");

        })
});
app.get("/budget4payment", auth, (req, res) => {

    username = req.user.name;
    res.render("budget4", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/budget4payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 799900,
                description: 'Backwater Ripples  Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/budget5payment", auth, (req, res) => {

    username = req.user.name;
    res.render("budget5", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/budget5payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2000000,
                description: 'Charismatic Kerala Family Holiday Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/budget6payment", auth, (req, res) => {

    username = req.user.name;
    res.render("budget6", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/budget6payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 4599900,
                description: 'Combo Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/premium1payment", auth, (req, res) => {

    username = req.user.name;
    res.render("premium1", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/premium1payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 1959900,
                description: 'Southern Sea Trip Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
        })
});
app.get("/premium2payment", auth, (req, res) => {

    username = req.user.name;
    res.render("premium2", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/premium2payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 3059900,
                description: 'Exotic kerala Package Booking ',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/premium3payment", auth, (req, res) => {

    username = req.user.name;
    res.render("premium3", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/premium3payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2459900,
                description: 'Misty Munnar Package Booking ',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");

        })
});
app.get("/premium4payment", auth, (req, res) => {

    username = req.user.name;
    res.render("premium4", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/premium4payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2459900,
                description: 'LAND OF PEACE AND TRANQUILITY KERALA  Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/honey1payment", auth, (req, res) => {

    username = req.user.name;
    res.render("honeymoon1", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/honey1payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2999900,
                description: 'Blissful Kerala Honeymoon Tour Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/honey2payment", auth, (req, res) => {

    username = req.user.name;
    res.render("honeymoon2", {
        name: username,
        key: Publishable_Key
    });
});
app.post('/honey2payment', auth, function(req, res) {

    username = req.user.name
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: username,

        })
        .then((customer) => {

            return stripe.charges.create({
                amount: 2299900,
                description: 'Exotic Kerala Honeymoon Special Package Booking',
                currency: 'inr',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("<div style='margin:auto;width:50%;border: 3px solid green; padding: 10px; text-align: center;'><h5 style='color:green;font-size:30px'>Success!</h5> <br><button style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'><a style='color: white;' href='/packages'>Go Back</a></button></div>");
            // If no error occurs 
        })
});
app.get("/new", auth, (req, res) => {
    res.render("new");
});
app.get("/cathedral", auth, (req, res) => {
    res.render("cathedral");
});
app.get("/light_house", auth, (req, res) => {
    res.render("light_house");
});
app.get("/kovolam", auth, (req, res) => {
    res.render("kovolam");
});
app.get("/napier", auth, (req, res) => {
    res.render("napier");
});
app.get("/zoo", auth, (req, res) => {
    res.render("zoo");
});
app.get("/synagogue", auth, (req, res) => {
    res.render("synagogue");
});
app.get("/island", auth, (req, res) => {
    res.render("island");
});
app.get("/bird", auth, (req, res) => {
    res.render("bird");
});
app.get("/fort_beach", auth, (req, res) => {
    res.render("fort_beach");
});
app.get("/church", auth, (req, res) => {
    res.render("church");
});
app.get("/devi_temple", auth, (req, res) => {
    res.render("devi_temple");
});
app.get("/backwater", auth, (req, res) => {
    res.render("backwater");
});
app.get("/alleppey_beach", auth, (req, res) => {
    res.render("alleppey_beach");
});
app.get("/alleppey_island", auth, auth, (req, res) => {
    res.render("alleppey_island");
});
app.get("/alleppey_museum", auth, (req, res) => {
    res.render("alleppey_museum");
});
app.get("/alleppey_church", auth, (req, res) => {
    res.render("alleppey_church");
});
app.get("/alleppey_temple", auth, (req, res) => {
    res.render("alleppey_temple");
});
app.get("/park", auth, (req, res) => {
    res.render("park");
});
app.get("/dam", auth, (req, res) => {
    res.render("dam");
});
app.get("/tea_museum", auth, (req, res) => {
    res.render("tea_museum");
});
app.get("/mountain", auth, (req, res) => {
    res.render("mountain");
});
app.get("/waterfall", auth, (req, res) => {
    res.render("waterfall");
});
app.get("/peak", auth, (req, res) => {
    res.render("peak");
});
app.get("/wildlife", auth, (req, res) => {
    res.render("wildlife");
});
app.get("/caves", auth, (req, res) => {
    res.render("caves");
});
app.get("/river", auth, (req, res) => {
    res.render("river");
});
app.get("/pookode_lake", auth, (req, res) => {
    res.render("pookode_lake");
});
app.get("/vishnu_temple", auth, (req, res) => {
    res.render("vishnu_temple");
});


app.get("/kanthapara_waterfalls", auth, (req, res) => {
    res.render("kanthapara_waterfalls");
});
app.get("/*", (req, res) => {
    res.status(404).render('404error')
});
app.listen(port, () => {
    console.log(`Server is Staring on port ${port}`);
});