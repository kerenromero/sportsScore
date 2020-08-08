if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const API_NBA = process.env.API_NBA;
const API_UCL = process.env.API_UCL;
const API_MLB = process.env.API_MLB;

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
        await account.update({ "_id": req.body.username }, { $push: { NBAteamsList: { $each: req.body.tempNBAteamsList }, MLBteamsList: { $each: req.body.tempMLBteamsList }, UCLteamsList: { $each: req.body.tempUCLteamsList } } });
        const acc = await account.find({ "_id": req.body.username });
        console.log(acc);
        const result = { NBAteamsList: acc[0].NBAteamsList, MLBteamsList: acc[0].MLBteamsList, UCLteamsList: acc[0].UCLteamsList, valid: true };
        res.json(result);

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
                    DateTime: response.data[i].DateTime,
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
            res.json(NBAgames);
        })
    } catch (err) {
        console.log(err);
    }
})

app.post('/apiMLB', async(req, res) => {
    try {
        console.log('inside try');

        axios({
            url: `https://api.sportsdata.io/v3/mlb/scores/json/GamesByDate/${req.body.date}?key=${API_MLB}`,
            method: 'get',
            responseType: 'json'
        }).then(response => {
            console.log(response.data);
            var MLBgames = [];
            for (let i = 0; i < response.data.length; i++) {
                var game = {
                    Status: response.data[i].Status,
                    DateTime: response.data[i].DateTime,
                    AwayTeam: response.data[i].AwayTeam,
                    HomeTeam: response.data[i].HomeTeam,
                    AwayTeamRuns: response.data[i].AwayTeamRuns,
                    HomeTeamRuns: response.data[i].HomeTeamRuns,
                    InningHalf: response.data[i].InningHalf,
                    Inning: response.data[i].Inning
                }
                MLBgames.push(game);
            }
            console.log(MLBgames);
            res.json(MLBgames);
        })
    } catch (err) {
        console.log(err);
    }
});

app.post('/apiUCL', async(req, res) => {
    try {
        axios({
            url: `https://api.sportsdata.io/v3/soccer/scores/json/GamesByDate/${req.body.date}?key=${API_UCL}`,
            method: 'get',
            responseType: 'json'

        }).then(response => {
            var UCLgames = [];
            for (let i = 0; i < response.data.length; i++) {
                var game = {
                    DateTime: response.data[i].DateTime,
                    Status: response.data[i].Status,
                    Clock: response.data[i].Clock,
                    Period: response.data[i].Period,
                    AwayTeamName: response.data[i].AwayTeamName,
                    AwayTeamScore: response.data[i].AwayTeamScore,
                    HomeTeamName: response.data[i].HomeTeamName,
                    HomeTeamScore: response.data[i].HomeTeamScore
                };
                UCLgames.push(game);
            }
            res.json(UCLgames);
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
            const result = { NBAteamsList: acc[0].NBAteamsList, MLBteamsList: acc[0].MLBteamsList, UCLteamsList: acc[0].UCLteamsList, valid: true };
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