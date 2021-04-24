const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("connection Sucessful to database");
}).catch((err) => {
    console.log(err);
})