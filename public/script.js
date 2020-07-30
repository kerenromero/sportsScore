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
var addTemasContainer = document.getElementById('addTeamsContainer');
var searchBar = document.getElementById('searchBar');
var searchBtn = document.getElementById('searchBtn');
var teamsToBeAdded = document.getElementById('teamsToBeAdded');
var doneAddingTeamsBtn = document.getElementById('doneAddingTeamsBtn');
var NBAteams = document.getElementById('NBAteams');
var NBAteamBtn = document.getElementsByClassName('NBAteamBtn');
var tempTeamsList = [];

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
        for (let i = 0; i < tempTeamsList.length; i++) {
            if (tempTeamsList[i] === clickObject.target.innerText) {
                console.log('insde if');
                tempTeamsList.splice(i, 1);
                break;
            }
        }
    } else {
        tempTeamsList.push(clickObject.target.innerText);
        clickObject.target.innerText = clickObject.target.innerText + "✓";
    }
    console.log(tempTeamsList);

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
            // hide login
            loginContainer.style.display = "none";
            // check if temas array is epmty
            if (data.teamsList.length == 0) {
                // add teams pop-up
                addTeamsContainer.style.display = "block";
                var NBA_Teams = ['Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'LA Clippers', 'LA Lakers', 'Memphis Grizzlies', 'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Hornets', 'New York Knicks', 'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia Sixers', 'Phoenix Suns', 'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'];
                printTeamsBtn(NBA_Teams);

                for (let i = 0; i < NBAteamBtn.length; i++) {
                    NBAteamBtn[i].addEventListener('click', addToTeamsList, false)
                }

                doneAddingTeamsBtn.addEventListener('click', () => {
                    fetch('/addToTeamsList', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/josn'
                        },
                        body: JSON.stringify({
                            username: loginUsername.value,
                            tempTeamsList: tempTeamsList
                        })
                    }).then(res => res.json()).then(data => {

                    })

                })
            } else {
                loginError.innerHTML = data;
            }
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

function printTeamsBtn(sportList) {
    for (var i = 0; i < sportList.length; i++) {
        var btn = document.createElement("button");
        btn.className += "NBAteamBtn";
        var t = document.createTextNode(sportList[i]);
        btn.appendChild(t);
        NBAteams.appendChild(btn);
    }
}