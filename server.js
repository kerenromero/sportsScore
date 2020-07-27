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

app.get('/', async(req, res) => {
    try {
        const accounts = await account.find();

    } catch {
        console.log('Error: fetching data from DB');
    }
});

app.post('/login', async(req, res) => {
    const acc = await account.find({ "_id": req.body.username });

    if (acc.length > 0) {
        if (req.body.password === acc[0].password) {
            res.json('both user name and password matched');
        } else {
            res.json('wrong password');
        }
    } else {
        res.json('Username not registered');
    }

})

app.post('/registerAccount', async(req, res) => {
    try {
        await account.create({ _id: req.body.username, password: req.body.password });
        const accounts = await account.find();
        console.log(accounts);
        res.json('okay');
    } catch (error) {
        console.log('Error:cannot create either username or password');
        res.json(error);
    }
});

app.post('/scores', (req, res) => {});

app.listen(3000, () => {
    console.log('Server Starter');
});