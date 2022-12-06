// DotEnv Configuration
require('dotenv').config();
// Require mongoose
const mongoose = require('mongoose');

// MongoDB URI
const URI = process.env.MongoDBURI;

const connectToDB = () => {
    mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return mongoose;
};

exports.default = connectToDB();
exports = module.exports = connectToDB();
