const { model } = require('mongoose');
const status = require('../schema/status');

const statusModel = model('status', status);

exports = module.exports = statusModel;
