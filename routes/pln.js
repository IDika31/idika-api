/**
 * @private
 */
const express = require('express');
const axios = require('axios').default;
const crypto = require('crypto')

const { makeErrorMessage, result } = require('../config/config');

/**
 *
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @param {express.NextFunction} next Express Next Function
 */

module.exports = (req, res, next) => {
    const query = req.query;

    const error = makeErrorMessage(query, ['idpelanggan'], ['Query "idpelanggan" is required!']);
    if (error.length > 0) return res.status(400).json(result({ error: true, errorMessage: error }, {}));

    const sign = crypto.createHash('md5').update(`628953470420081476270b6ebdbe5dZQM0${query.idpelanggan}`).digest('hex');

    axios
        .post('https://prepaid.iak.dev/api/inquiry-pln', {
            username: '62895347042008',
            customer_id: query.idpelanggan,
            sign,
        })
        .then((results) => {
            return res.json(results.data)
            const data = {
                voucherid: 'pln',
                no_pelanggan: results.data.data.customer_id,
                no_meter: results.data.data.meter_no,
                nama: results.data.data.name,
                power: results.data.data.segment_power,
            };
            return res.status(200).json(result({}, data));
        })
        .catch(() => {
            return res.status(200).json(result({ error: true, errorMessage: [`No data found using idpelanggan: "${query.idpelanggan}"`] }, {}));
        });
};
