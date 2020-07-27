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

registerLink.addEventListener('click', () => {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
})

loginLink.addEventListener('click', () => {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
})

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
        loginError.innerHTML = data;
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
            error.innerHTML = 'Username already taken.';
        });
    } else {
        error.innerHTML = 'Passwords did not match.';
    }
})