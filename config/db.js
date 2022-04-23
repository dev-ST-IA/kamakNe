const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

exports.connect = async () => {
    await mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Database Connected!");
        })
        .catch((err) => {
            console.log(`Error Connecting to Database. \n\n ${err}`);
        });
}
