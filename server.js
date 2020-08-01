if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const API_NBA = process.env.API_NBA;
const express = require('express');
const mongoose = require('mongoose');
const account = require('./models/account');
const axios = require('axios')
const fetch = require('node-fetch')


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

app.post('/addToTeamsList', async(req, res) => {
    try {
        //for (let i = 0; i < req.body.tempTeamsList.length; i++) {
        await account.update({ "_id": req.body.username }, { $push: { teamsList: { $each: req.body.tempTeamsList } } })
            //}
        const acc = await account.find({ "_id": req.body.username });
        console.log(acc);

    } catch {
        console.log('Unable to add to db');
    }
})

app.post('/apiNBA', async(req, res) => {
    try {
        axios({

            url: `https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/${req.body.date}?key=${API_NBA}`,
            method: 'get',
            responseType: 'json'

        }).then(response => {
            var NBAgames = [];
            for (let i = 0; i < response.data.length; i++) {
                var game = {
                    Status: response.data[i].Status,
                    AwayTeam: response.data[i].AwayTeam,
                    HomeTeam: response.data[i].HomeTeam,
                    AwayTeamScore: response.data[i].AwayTeamScore,
                    HomeTeamScore: response.data[i].HomeTeamScore,
                    Quarter: response.data[i].Quarter,
                    TimeRemainingMinutes: response.data[i].TimeRemainingMinutes,
                    TimeRemainingSeconds: response.data[i].TimeRemainingSeconds
                };
                NBAgames.push(game);
            }
            console.log(NBAgames);
            res.json(NBAgames);
        })
    } catch (err) {
        console.log(err);
    }
})



app.post('/login', async(req, res) => {
    const acc = await account.find({ "_id": req.body.username });
    console.log(acc);
    if (acc.length > 0) {
        if (req.body.password === acc[0].password) {
            const result = { teamsList: acc[0].teamsList, valid: true };
            res.json(result);
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