// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }

const API_KEYS = process.env.API_KEYS;
const express = require('express');
const mongoose = require('mongoose');
const account = require('./models/account');

const app = express();

mongoose.connect('mongodb://localhost/sportsScore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(express.json());
app.use(express.static('public'));

`--unhandled-rejections=strict`
app.get('/', async(req, res) => {
    try {
        const accounts = await account.find();

    } catch {
        console.log('Error: fetching data from DB');
    }
    console.log('inside get');
    console.log(accounts);
});

`--unhandled-rejections=strict`
app.post('/account', async(req, res) => {
    console.log(req.body);
    try {
        await account.create({ username: req.body.username, password: req.body.password });
        const accounts = await account.find();
        console.log(accounts);


    } catch {
        console.log('Error:cannot create either username or password');
    }
    res.redirect('/');
});

app.post('/scores', (req, res) => {});

app.listen(3000, () => {
    console.log('Server Starter');
});