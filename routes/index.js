const model = require('../database/models/api.key');

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express.Router();

const { corsOptions, apiKey } = require('../config/config');

const statusModel = require('../database/models/status');

app.get('/game/mobile_legends/username', cors(corsOptions), apiKey, require('./mobile_legends'));
app.get('/game/free_fire/username', cors(corsOptions), apiKey, require('./free_fire'));
app.get('/game/higgs_domino/username', cors(corsOptions), apiKey, require('./higgs_domino'));
app.get('/game/codm/username', cors(corsOptions), apiKey, require('./codm'));
app.get('/game/point_blank/username', cors(corsOptions), apiKey, require('./point_blank'));
app.get('/voucher/pln/username', cors(corsOptions), apiKey, require('./pln'))

app.get('/apiKey/list/', async (req, res) => {
    let list = await model.find();
    if(list) {
        list = list.map((v) => {
            return {
                name: v.name,
                domain: v.domain,
            };
        })
        return res.status(200).json({
            status: true,
            error: [],
            data: list
        }); 
    } else return res.status(200).json({
        status: false,
        error: ['No apiKey has been registered'],
        data: null
    })
})

app.get('/apiKey/list/add', async (req, res) => {
    return res.status(200).send(`<form action="/apiKey/list/add" method="post">
        <input type="text" name="name" placeholder="API Key Name">
        <input type="text" name="domain" placeholder="Domain For API Key">
        <input type="text" name="email" placeholder="Email For API Key">
        <input type="tel" name="phone_number" placeholder="Phone Number For API Key">
        <input type="tel" name="duration" placeholder="Duration For API Key">
        <input type="text" name="key" placeholder="Secret Key">
        <button type="submit">Submit</button>
    </form>`);
})

app.post('/apiKey/list/add', async (req, res) => {
    const { name, domain, email, phone_number, duration, key } = req.body;
    if(key === 'IDika_31-07-06') {
        const data = {
            name,
            domain,
            email,
            phone_number,
            duration: Date.now() + duration * 8.64e7,
        };
        const user = await model.create(data);
        return res.status(200).json({
            status: true,
            error: [],
            data: user,
        });
    } else return res.status(200).json({
        status: false,
        error: ['Invalid key'],
        data: null,
    });
})

app.get('/domainList/status', cors(corsOptions), async (req, res) => {
    const query = req.query;

    const apiKey = 'IDika';

    const status = await statusModel.findOne({ id: 'domainListAllowStatus' });
    if (!status) {
        await statusModel.create({
            id: 'domainListAllowStatus',
            status: false,
        });
    }

    if (query.apiKey === apiKey || query.apikey === apiKey) {
        return res.status(200).json({
            status: true,
            data: {
                status: status.status,
            },
        });
    } else
        res.status(200).json({
            status: false,
            error: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!!',
        });
});

app.get('/domainList/status/change/allow', cors(corsOptions), async (req, res) => {
    const query = req.query;

    const apiKey = 'IDika';

    const status = await statusModel.findOne({ id: 'domainListAllowStatus' });
    if (!status) {
        await statusModel.create({
            id: 'domainListAllowStatus',
            status: false,
        });
    }

    if (query.apiKey === apiKey || query.apikey === apiKey) {
        if (!status.status) {
            await statusModel.updateOne(
                { id: 'domainListAllowStatus' },
                {
                    $set: {
                        status: true,
                    },
                }
            );
        }

        return res.status(200).json({
            status: true,
            data: {
                status: {
                    before: status.status,
                    after: true,
                },
            },
        });
    } else
        res.status(200).json({
            status: false,
            error: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!!',
        });
});

app.get('/domainList/status/change/disallow', cors(corsOptions), async (req, res) => {
    const query = req.query;

    const apiKey = 'IDika';

    const status = await statusModel.findOne({ id: 'domainListAllowStatus' });
    if (!status) {
        await statusModel.create({
            id: 'domainListAllowStatus',
            status: false,
        });
    }

    if (query.apiKey === apiKey || query.apikey === apiKey) {
        if (status.status) {
            await statusModel.updateOne(
                { id: 'domainListAllowStatus' },
                {
                    $set: {
                        status: false,
                    },
                }
            );
        }

        return res.status(200).json({
            status: true,
            data: {
                status: {
                    before: status.status,
                    after: false,
                },
            },
        });
    } else
        res.status(200).json({
            status: false,
            error: 'Unauthorized. You need an API Key in the query "apiKey" to access this API. Contact 62895347043008 at Whatsapp to get the API Key!!',
        });
});

module.exports = app;
