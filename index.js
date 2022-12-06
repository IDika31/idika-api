// Require Express
const express = require('express');

// Express Application
const app = express();

// Rerquire Config
const config = require('./config/config')
// Require Router
const router = require('./routes/')

// Express Config
app.use(config.expressUse());
// Routes
app.use(router);

// Express Listen
app.listen(process.env.PORT || 3000, () => {
    // Log When Connection is Success
    console.log('Server is running on port 3000');

    // Connect To Database
    config.connectToDB().then((err) => {
        // Throw new error when connection is failed
        if(err) throw new Error(err.message)

        // Log When Connection to Database is Success
        console.log('Connected to Database!')
    })
});