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

registerLink.addEventListener('click', () => {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
})

loginLink.addEventListener('click', () => {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
})

registerBtn.addEventListener('click', () => {
    //check if username is available 
    // check if passwords match
    if (registerPassword.value === confirmPassword.value) {
        // pass to server
        console.log('here');
        fetch('/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/josn'
            },
            body: JSON.stringify({
                username: registerUsername.value,
                password: confirmPassword.value
            })

        })
        console.log('after fetch');



    } else {

    }
})