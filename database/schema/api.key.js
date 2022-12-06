const { Schema } = require('mongoose');
const validator = require('validator').default;

const apiKeySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    invoice_id: {
        type: String,
    },
    domain: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (email) => {
                return validator.isEmail(email);
            },
            message: (email) => `'${email.value} is not a valid email!'`,
        },
    },
    phone_number: {
        type: String,
        validate: {
            validator: (number) => {
                return validator.isMobilePhone(number, 'id-ID');
            },
            message: (number) => `'${number.value} is not a valid indonesia phone number!'`,
        },
    },
    duration: {
        type: Number,
        required: true,
        validate: {
            validator: (duration) => {
                return duration > 0;
            },
            message: (duration) => `'${duration.value} is not a valid duration!'`,
        },
    }
});

exports = module.exports = apiKeySchema;
