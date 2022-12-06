/**
 * @private
 */
const express = require('express');
const axios = require('axios').default;

const { makeErrorMessage, result } = require('../config/config');

/**
 *
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @param {express.NextFunction} next Express Next Function
 */

module.exports = (req, res, next) => {
    const query = req.query;

    const error = makeErrorMessage(query, ['userid', 'zoneid'], ['Query "userid" is required!', 'Query "zoneid" is required!']);
    if (error.length > 0) return res.status(400).json(result({ error: true, errorMessage: error }, {}));
    
    axios
        .post('https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store', {
            productId: 1,
            itemId: 66,
            catalogId: 121,
            paymentId: 805,
            gameId: query.userid,
            zoneId: query.zoneid,
            product_ref: 'CMS',
            product_ref_denom: 'AE',
        })
        .then((results) => {
            const data = {
                gameid: query.gameid,
                username: results.data.data.userNameGame,
                userid: results.data.data.gameId,
                zoneid: results.data.data.zoneId,
            };
            return res.status(200).json(result({}, data));
        })
        .catch(() => {
            return res.status(200).json(result({ error: true, errorMessage: [`No data found using userid: "${query.userid}" and zoneid: "${query.zoneid}"`] }, {}));
        });
};
