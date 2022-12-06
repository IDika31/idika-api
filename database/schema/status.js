const { Schema } = require('mongoose');

const status = new Schema({
    status: {
        type: Boolean,
        required: true,
    },
    id: {
        type: String,
        required: true,
    }
});

exports = module.exports = status;
