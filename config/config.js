'use strict';

/**
 * Module dependencies.
 * @private
 */
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const domainList = ['https://www.nevipedia.com'];

const apiKeyModel = require('../database/models/api.key');
const statusModel = require('../database/models/status');

/**
 *
 * @param {express.Request} req
 * @param {cors.CorsOptions} callback
 */
const corsOptions = {
    origin: true,
    method: ['GET'],
};

const expressUse = function () {
    const app = express();
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compression());

    return app;
};

/**
 *
 * @param {*} query Request queries
 * @param {Array<string>} queryNeed Required queries
 * @param {Array<string>} queryMessage Message if the required query is not found
 * @returns {Array<string>} Error message in array
 */
const makeErrorMessage = (query, queryNeed, queryMessage) => {
    const arr = [];

    queryNeed.forEach((val, index) => {
        if (!query[val] || query[val] === '' || query[val] === undefined || query[val] === null || query[val] === 'null' || query[val] === 'undefined' || query[val] === '?') return arr.push(queryMessage[index]);
    });

    return arr;
};

/**
 *
 * @param {{error: null | boolean, errorMessage: Array<string>}}
 * @param {Object} data
 * @returns {{
 *  error: null | boolean,
 *  errorMessage: Array<string>,
 *  data: {
 *    gameid: string,
 *    username: string,
 *    userid: string,
 *    zoneid?: string,
 *  }
 * }}
 */
const result = ({ error = null, errorMessage = [] }, data) => {
    if (error) {
        return {
            error,
            errorMessage,
            data: {},
        };
    } else
        return {
            error: null,
            errorMessage,
            data,
        };
};

/**
 *
 * @returns {Promise<Error>}
 */
const connectToDB = () => {
    return new Promise((resolve) => {
        const database = require('../database/mongo.db').default;

        database.connection.on('connected', () => {
            resolve(null);
        });

        database.connection.on('error', (err) => {
            resolve(new Error(err.message));
        });

        database.connection.on('disconnected', () => {
            resolve(new Error('Connection to Database was Disconnected!'));
        });

        database.connection.on('close', () => {
            resolve(new Error('Connection to Database was Closed!'));
        });

        database.connection.on('timeout', () => {
            resolve(new Error('Connection to Database was Timeout!'));
        });
    });
};

/**
 *
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @param {express.NextFunction} next Express NextFunction
 */
const apiKey = async (req, res, next) => {
    if (/^\/(game)\/(\w)+\/username(\/)?$/g.test(req.path)) {
        const status = await statusModel.findOne({ id: 'domainListAllowStatus' });
        if (domainList.indexOf(req.headers.origin) >= 0 && status.status) return next();

        const query = req.query;

        const error = makeErrorMessage(query, ['apiKey'], ['']);
        if (error.length > 0)
            return res.status(200).json(
                result(
                    {},
                    {
                        gameid: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!',
                        username: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!',
                        userid: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!',
                        zoneid: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!',
                    }
                )
            );

        const model = apiKeyModel;
        model
            .findOne({ _id: query.apiKey })
            .then(async (user) => {
                if (user.domain === req.headers.referer) {
                    if (user.duration > Date.now()) {
                        return next();
                    } else {
                        await model.deleteOne({ _id: query.apiKey });
                        return res.status(200).json(
                            result(
                                {},
                                {
                                    gameid: 'Unauthorized. API Key you have entered was expired! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                    username: 'Unauthorized. API Key you have entered was expired! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                    userid: 'Unauthorized. API Key you have entered was expired! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                    zoneid: 'Unauthorized. API Key you have entered was expired! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                }
                            )
                        );
                    }
                } else {
                    return res.status(200).json(
                        result(
                            {},
                            {
                                gameid: 'The domain registered in the API Key you entered does not match your current domain! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                username: 'The domain registered in the API Key you entered does not match your current domain! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                userid: 'The domain registered in the API Key you entered does not match your current domain! Contact 62895347043008 at Whatsapp to get the new API Key!',
                                zoneid: 'The domain registered in the API Key you entered does not match your current domain! Contact 62895347043008 at Whatsapp to get the new API Key!',
                            }
                        )
                    );
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(200).json(
                    result(
                        {},
                        {
                            gameid: 'Unauthorized. API Key you have entered was not found! Contact 62895347043008 at Whatsapp to get the API Key!',
                            username: 'Unauthorized. API Key you have entered was not found! Contact 62895347043008 at Whatsapp to get the API Key!',
                            userid: 'Unauthorized. API Key you have entered was not found! Contact 62895347043008 at Whatsapp to get the API Key!',
                            zoneid: 'Unauthorized. API Key you have entered was not found! Contact 62895347043008 at Whatsapp to get the API Key!',
                        }
                    )
                );
            });
    } else return next();
};

module.exports = {
    expressUse,
    makeErrorMessage,
    result,
    corsOptions,
    apiKey,
    connectToDB,
};
