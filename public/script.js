import teams from './teams.js';


// const { json } = require("express");
var registerLink = document.getElementById('registerLink');
var loginLink = document.getElementById('loginLink');
var registerContainer = document.getElementById('registerContainer');
var loginContainer = document.getElementById('loginContainer');
var registerBtn = document.getElementById('registerBtn');
var loginBtn = document.getElementById('loginBtn');
var loginUsername = document.getElementById('loginUsername');
var loginPassword = document.getElementById('loginPassword');
var loginBtn = document.getElementById('loginBtn');
var registerUsername = document.getElementById('registerUsername');
var registerPassword = document.getElementById('registerPassword');
var confirmPassword = document.getElementById('confirmPassword');
var registerBtn = document.getElementById('registerBtn');
var error = document.getElementById('Error');
var loginError = document.getElementById('loginError');
var addTeamsContainer = document.getElementById('addTeamsContainer');
var teamsToBeAdded = document.getElementById('teamsToBeAdded');
var AddRemoveTeams = document.getElementById('AddRemoveTeams');
var doneAddingTeamsBtn = document.getElementById('doneAddingTeamsBtn');
var NBAteams = document.getElementById('NBAteams');
var NBAteamBtn = document.getElementsByClassName('NBAteamBtn');
var MLBteams = document.getElementById('MLBteams');
var MLBteamBtn = document.getElementsByClassName('MLBteamBtn');
var UCLteams = document.getElementById('UCLteams');
var UCLteamBtn = document.getElementsByClassName('UCLteamBtn');
var NBAgameInstanceContainer = document.getElementById('NBAgameInstanceContainer');
var MLBgameInstanceContainer = document.getElementById('MLBgameInstanceContainer');
var UCLgameInstanceContainer = document.getElementById('UCLgameInstanceContainer');
var liveScoresContainer = document.getElementById('liveScoresContainer');
var tempNBAteamsList = [];
var tempMLBteamsList = [];
var tempUCLteamsList = [];

window.onscroll = function() { myFunction() };

var navbar = document.getElementById("navbar");

var sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}


registerLink.addEventListener('click', () => {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
})

loginLink.addEventListener('click', () => {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
})

var addToTeamsList = (clickObject) => {
    if (clickObject.target.innerText.includes("✓")) {
        clickObject.target.innerText = clickObject.target.innerText.replace("✓", '');
        if (clickObject.target.className === 'NBAteamBtn') {
            for (let i = 0; i < tempNBAteamsList.length; i++) {
                if (tempNBAteamsList[i] === clickObject.target.innerText) {
                    tempNBAteamsList.splice(i, 1);
                    break;
                }
            }
        } else if (clickObject.target.className === 'MLBteamBtn') {
            for (let i = 0; i < tempMLBteamsList.length; i++) {
                if (tempMLBteamsList[i] === clickObject.target.innerText) {
                    tempMLBteamsList.splice(i, 1);
                    break;
                }
            }
        } else {
            for (let i = 0; i < tempUCLteamsList.length; i++) {
                if (tempUCLteamsList[i] === clickObject.target.innerText) {
                    tempUCLteamsList.splice(i, 1);
                    break;
                }
            }
        }

    } else {
        if (clickObject.target.className === 'NBAteamBtn') {
            tempNBAteamsList.push(clickObject.target.innerText);
        } else if (clickObject.target.className === 'MLBteamBtn') {
            tempMLBteamsList.push(clickObject.target.innerText);
        } else {
            tempUCLteamsList.push(clickObject.target.innerText);
        }
        clickObject.target.innerText = clickObject.target.innerText + "✓";


    }
    console.log(tempNBAteamsList);
    console.log(tempMLBteamsList);
    console.log(tempUCLteamsList);

}

loginBtn.addEventListener('click', () => {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/josn'
        },
        body: JSON.stringify({
            username: loginUsername.value,
            password: loginPassword.value
        })
    }).then(res => res.json()).then(data => {

        if (data.valid == true) {
            const NBAaccountSession = data.NBAteamsList;
            const MLBaccountSession = data.MLBteamsList;
            const UCLaccountSession = data.UCLteamsList;
            loginContainer.style.display = "none";
            if (NBAaccountSession.length == 0 && MLBaccountSession.length == 0 && UCLaccountSession.length == 0) {
                addTeamsContainer.style.display = "block";
                //array             //class name   // div
                printTeamsBtn(teams.NBA_TeamsArray, "NBAteamBtn", NBAteams);
                printTeamsBtn(teams.MLB_TeamsArray, "MLBteamBtn", MLBteams);
                printTeamsBtn(teams.UCL_TeamsArray, "UCLteamBtn", UCLteams);


                addEventListenerToBtns(NBAteamBtn);
                addEventListenerToBtns(MLBteamBtn);
                addEventListenerToBtns(UCLteamBtn);

                doneAddingTeamsBtn.addEventListener('click', () => {
                    fetch('/addToTeamsList', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/josn'
                        },
                        body: JSON.stringify({
                            username: loginUsername.value,
                            tempNBAteamsList: tempNBAteamsList,
                            tempMLBteamsList: tempMLBteamsList,
                            tempUCLteamsList: tempUCLteamsList


                        })
                    }).then(res => res.json()).then(data => {
                        const NBAaccountSessions = data.NBAteamsList;
                        const MLBaccountSessions = data.MLBteamsList;
                        const UCLaccountSessions = data.UCLteamsList;
                        matchNBATeamToLiveTeams(NBAaccountSessions, teams.NBA_TeamsMap);
                        matchMLBTeamToLiveTeams(MLBaccountSessions, teams.MLB_TeamsMap);
                        matchUCLTeamToLiveTeams(UCLaccountSessions);
                        addTeamsContainer.style.display = 'none';
                        liveScoresContainer.style.display = 'block';

                        AddRemoveTeams.addEventListener('click', (event) => {
                            event.preventDefault();
                            liveScoresContainer.style.display = 'none';
                            addTeamsContainer.style.display = 'block';

                            NBAgameInstanceContainer.innerHTML = '';
                            MLBgameInstanceContainer.innerHTML = '';
                            UCLgameInstanceContainer.innerHTML = '';

                            reprintTeamsBtn(teams.NBA_TeamsArray, "NBAteamBtn", NBAteams, NBAaccountSessions, tempNBAteamsList);
                            reprintTeamsBtn(teams.MLB_TeamsArray, "MLBteamBtn", MLBteams, MLBaccountSessions, tempMLBteamsList);
                            reprintTeamsBtn(teams.UCL_TeamsArray, "UCLteamBtn", UCLteams, UCLaccountSessions, tempUCLteamsList);

                            addEventListenerToBtns(NBAteamBtn);
                            addEventListenerToBtns(MLBteamBtn);
                            addEventListenerToBtns(UCLteamBtn);


                        });



                    })

                })
            } else {

                matchNBATeamToLiveTeams(NBAaccountSession, teams.NBA_TeamsMap);
                matchMLBTeamToLiveTeams(MLBaccountSession, teams.MLB_TeamsMap);
                matchUCLTeamToLiveTeams(UCLaccountSession);
                liveScoresContainer.style.display = 'block';

                AddRemoveTeams.addEventListener('click', (event) => {
                    event.preventDefault();
                    liveScoresContainer.style.display = 'none';
                    addTeamsContainer.style.display = 'block';
                    NBAgameInstanceContainer.innerHTML = '';
                    MLBgameInstanceContainer.innerHTML = '';
                    UCLgameInstanceContainer.innerHTML = '';

                    reprintTeamsBtn(teams.NBA_TeamsArray, "NBAteamBtn", NBAteams, NBAaccountSession, tempNBAteamsList);
                    reprintTeamsBtn(teams.MLB_TeamsArray, "MLBteamBtn", MLBteams, MLBaccountSession, tempMLBteamsList);
                    reprintTeamsBtn(teams.UCL_TeamsArray, "UCLteamBtn", UCLteams, UCLaccountSession, tempUCLteamsList);
                    addEventListenerToBtns(NBAteamBtn);
                    addEventListenerToBtns(MLBteamBtn);
                    addEventListenerToBtns(UCLteamBtn);

                    doneAddingTeamsBtn.addEventListener('click', () => {
                        fetch('/addToTeamsList', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/josn'
                            },
                            body: JSON.stringify({
                                username: loginUsername.value,
                                tempNBAteamsList: tempNBAteamsList,
                                tempMLBteamsList: tempMLBteamsList,
                                tempUCLteamsList: tempUCLteamsList


                            })
                        }).then(res => res.json()).then(data => {
                            const NBAaccountSessions = data.NBAteamsList;
                            const MLBaccountSessions = data.MLBteamsList;
                            const UCLaccountSessions = data.UCLteamsList;
                            matchNBATeamToLiveTeams(NBAaccountSessions, teams.NBA_TeamsMap);
                            matchMLBTeamToLiveTeams(MLBaccountSessions, teams.MLB_TeamsMap);
                            matchUCLTeamToLiveTeams(UCLaccountSessions);
                            addTeamsContainer.style.display = 'none';
                            liveScoresContainer.style.display = 'block';
                        })
                    });


                })
            }
        } else {
            loginError.innerHTML = data;
        }
    })
})

registerBtn.addEventListener('click', () => {

    if (registerPassword.value === confirmPassword.value) {
        error.innerHTML = '';
        fetch('/registerAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/josn'
            },
            body: JSON.stringify({
                username: registerUsername.value,
                password: confirmPassword.value
            })

        }).then(res => res.json()).then(data => {
            if (data === 'okay') {
                registerContainer.style.display = "none";
                loginContainer.style.display = "block";
                loginError.innerHTML = 'Registration complete. Please login.'
            } else {
                error.innerHTML = 'Username already taken.';

            }
        });

    } else {
        error.innerHTML = 'Passwords did not match.';
    }
})

function printTeamsBtn(sportList, sportStringBtn, sportsDiv) {

    for (var i = 0; i < sportList.length; i++) {
        var btn = document.createElement("button");
        btn.className += sportStringBtn;
        var t = document.createTextNode(sportList[i]);
        btn.appendChild(t);
        sportsDiv.appendChild(btn);
    }
}

function reprintTeamsBtn(sportList, sportStringBtn, sportsDiv, mySportsArray, tempArray) {
    sportsDiv.innerHTML = '';
    for (var i = 0; i < sportList.length; i++) {
        var btn = document.createElement("button");
        btn.className += sportStringBtn;
        if (mySportsArray.includes(sportList[i])) {
            var t = document.createTextNode(sportList[i] + "✓");
            if (!tempArray.includes(sportList[i])) {
                tempArray.push(sportList[i]);
            }

        } else {
            var t = document.createTextNode(sportList[i]);
        }
        btn.appendChild(t);
        sportsDiv.appendChild(btn);
    }
}

function addEventListenerToBtns(btn) {

    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', addToTeamsList, false)
    }

}

function matchNBATeamToLiveTeams(teamsList, abriviationMap) {

    var today = new Date();
    var month = today.getMonth() + 1;
    var formattedMonth;

    switch (month) {
        case 1:
            formattedMonth = 'JAN';
            break;
        case 2:
            formattedMonth = 'FEB';
            break;
        case 3:
            formattedMonth = 'MAR';
            break;
        case 4:
            formattedMonth = 'APR';
            break;
        case 5:
            formattedMonth = 'MAY';
            break;
        case 6:
            formattedMonth = 'JUN';
            break;
        case 7:
            formattedMonth = 'JUL';
            break;
        case 8:
            formattedMonth = 'AUG';
            break;
        case 9:
            formattedMonth = 'SEP';
            break;
        case 10:
            formattedMonth = 'OCT';
            break;
        case 11:
            formattedMonth = 'NOV';
            break;
        case 12:
            formattedMonth = 'DEC';
            break;
        default:
            formattedMonth = '';
    }

    var NBAdate = today.getFullYear() + '-' + (formattedMonth) + '-' + today.getDate();

    // api call
    fetch('/apiNBA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/josn'
        },
        body: JSON.stringify({
            date: NBAdate
        })
    }).then(res => res.json()).then(data => {

        // liveScoresContainer.style.display = 'block';


        for (let i = 0; i < data.length; i++) {
            if (teamsList.includes(abriviationMap.get(data[i].HomeTeam)) || teamsList.includes(abriviationMap.get(data[i].AwayTeam))) {
                displayNBATeams(data[i], abriviationMap);
            }
        }
    })

}

function matchMLBTeamToLiveTeams(teamsList, abriviationMap) {
    var today = new Date();
    var month = today.getMonth() + 1;
    var date;

    if (month.length == 1) {
        date = today.getFullYear() + '-' + '0' + month + '-' + today.getDate();
    } else {
        date = today.getFullYear() + '-' + month + '-' + today.getDate();
    }

    fetch('/apiMLB', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/josn'
        },
        body: JSON.stringify({
            date: date
        })
    }).then(res => res.json()).then(data => {

        for (let i = 0; i < data.length; i++) {
            if (teamsList.includes(abriviationMap.get(data[i].HomeTeam)) || teamsList.includes(abriviationMap.get(data[i].AwayTeam))) {
                displayMLBTeams(data[i], abriviationMap);
            }
        }

    })


}

function matchUCLTeamToLiveTeams(teamsList) {

    var today = new Date();
    var month = today.getMonth() + 1;
    var date;

    if (month.length == 1) {
        date = today.getFullYear() + '-' + '0' + month + '-' + today.getDate();
    } else {
        date = today.getFullYear() + '-' + month + '-' + today.getDate();
    }

    fetch('/apiUCL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/josn'
        },
        body: JSON.stringify({
            date: date
        })
    }).then(res => res.json()).then(data => {
        //if (liveScoresContainer.style.display === 'none') {
        // liveScoresContainer.style.display = 'block';
        //}
        for (let i = 0; i < data.length; i++) {
            if (teamsList.includes(data[i].HomeTeamName) || teamsList.includes(data[i].AwayTeamName)) {

                displayUCLTeams(data[i]);
            }
        }

    })
}

function displayNBATeams(gameInstance, abriviationMap) {

    var gameDiv = document.createElement("div");
    gameDiv.className = "gameDiv";

    var teamsDiv = document.createElement("div");
    teamsDiv.className = "teamsDiv";

    var scoreDiv = document.createElement("div");
    scoreDiv.className = "scoreDiv";


    var homeTeam = document.createElement("h3");
    homeTeam.innerText = abriviationMap.get(gameInstance.HomeTeam);
    teamsDiv.appendChild(homeTeam);

    var awayTeam = document.createElement("h3");
    awayTeam.innerText = abriviationMap.get(gameInstance.AwayTeam);
    teamsDiv.appendChild(awayTeam);

    var homeTeamScore = document.createElement("h3");
    homeTeamScore.innerText = gameInstance.HomeTeamScore;
    scoreDiv.appendChild(homeTeamScore);

    var awayTeamScore = document.createElement("h3");
    awayTeamScore.innerText = gameInstance.AwayTeamScore;
    scoreDiv.appendChild(awayTeamScore);

    gameDiv.appendChild(teamsDiv);
    gameDiv.appendChild(scoreDiv);

    var status = document.createElement("h3");
    if (gameInstance.Status === 'InProgress') {
        if (gameInstance.Quarter === 'Half') {
            status.innerText = 'Half';
        } else {
            status.innerText = 'Q' + gameInstance.Quarter + ' ' + gameInstance.TimeRemainingMinutes + ':' + gameInstance.TimeRemainingSeconds;
        }
    } else if (gameInstance.Status === 'Final') {
        status.innerText = gameInstance.Status;
    } else {
        status.innerText = "Today " + gameInstance.DateTime.slice(11, 16);

    }
    gameDiv.appendChild(status);

    NBAgameInstanceContainer.appendChild(gameDiv);

}

function displayMLBTeams(gameInstance, abriviationMap) {

    var gameDiv = document.createElement("div");
    gameDiv.className = "gameDiv";

    var teamsDiv = document.createElement("div");
    teamsDiv.className = "teamsDiv";

    var scoreDiv = document.createElement("div");
    scoreDiv.className = "scoreDiv";


    var homeTeam = document.createElement("h3");
    homeTeam.innerText = abriviationMap.get(gameInstance.HomeTeam);
    teamsDiv.appendChild(homeTeam);

    var awayTeam = document.createElement("h3");
    awayTeam.innerText = abriviationMap.get(gameInstance.AwayTeam);
    teamsDiv.appendChild(awayTeam);

    var homeTeamRuns = document.createElement("h3");
    homeTeamRuns.innerText = gameInstance.HomeTeamRuns;
    scoreDiv.appendChild(homeTeamRuns);

    var awayTeamRuns = document.createElement("h3");
    awayTeamRuns.innerText = gameInstance.AwayTeamRuns;
    scoreDiv.appendChild(awayTeamRuns);

    gameDiv.appendChild(teamsDiv);
    gameDiv.appendChild(scoreDiv);

    var status = document.createElement("h3");
    if (gameInstance.Status === 'InProgress') {
        if (gameInstance.Inning === 1) {
            status.innerText = gameInstance.InningHalf + ' ' + gameInstance.Inning + 'st';
        } else if (gameInstance.Inning === 2) {
            status.innerText = gameInstance.InningHalf + ' ' + gameInstance.Inning + 'nd';

        } else if (gameInstance.Inning === 3) {
            status.innerText = gameInstance.InningHalf + ' ' + gameInstance.Inning + 'rd';

        } else {
            status.innerText = gameInstance.InningHalf + ' ' + gameInstance.Inning + 'th';
        }
    } else if (gameInstance.Status === 'Final') {
        status.innerText = gameInstance.Status;
    } else {
        status.innerText = "Today " + gameInstance.DateTime.slice(11, 16);

    }
    gameDiv.appendChild(status);

    MLBgameInstanceContainer.appendChild(gameDiv);

}

function displayUCLTeams(gameInstance) {

    var gameDiv = document.createElement("div");
    gameDiv.className = "gameDiv";

    var teamsDiv = document.createElement("div");
    teamsDiv.className = "teamsDiv";

    var scoreDiv = document.createElement("div");
    scoreDiv.className = "scoreDiv";

    var homeTeamName = document.createElement("h3");
    homeTeamName.innerText = gameInstance.HomeTeamName;
    teamsDiv.appendChild(homeTeamName);

    var awayTeamName = document.createElement("h3");
    awayTeamName.innerText = gameInstance.AwayTeamName;
    teamsDiv.appendChild(awayTeamName);

    var homeTeamScore = document.createElement("h3");
    homeTeamScore.innerText = gameInstance.HomeTeamScore;
    scoreDiv.appendChild(homeTeamScore);

    var awayTeamScore = document.createElement("h3");
    awayTeamScore.innerText = gameInstance.AwayTeamScore;
    scoreDiv.appendChild(awayTeamScore);

    gameDiv.appendChild(teamsDiv);
    gameDiv.appendChild(scoreDiv);

    var status = document.createElement("h3");
    if (gameInstance.Status === 'InProgress') {
        //check what clcok actually is at the half 
        if (gameInstance.Clock === 'Half') {
            status.innerText = 'HT';
        } else {
            status.innerText = gameInstance.Clock + '\'';
        }
    } else if (gameInstance.Status === 'Final') {
        status.innerText = gameInstance.Status;
    } else {
        status.innerText = "Today " + gameInstance.DateTime.slice(11, 16);

    }


    gameDiv.appendChild(status);

    UCLgameInstanceContainer.appendChild(gameDiv);

}