const { model } = require('mongoose');
const apiKeySchema = require('../schema/api.key');

const apiKeyModel = model('checkidgame', apiKeySchema);

exports = module.exports = apiKeyModel;