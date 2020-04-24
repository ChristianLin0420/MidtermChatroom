// Activate clock
var interval = setInterval(clock, 1000);

function clock() {
    var hours = document.getElementById('hour');
    var minutes = document.getElementById('minute');
    var seconds = document.getElementById('second');

    var h = new Date().getHours();
    var m = new Date().getMinutes();
    var s = new Date().getSeconds();

    hours.innerHTML = h;
    minutes.innerHTML = m;
    seconds.innerHTML = s;
}  

// Initial login page
function initLogin() {
    var txtEmail = document.getElementById('Email');
    var txtPassword = document.getElementById('Password');
    var btnLogin = document.getElementById('SignIn');
    var btnSignup = document.getElementById('SignUp');
    var btnGoogle = document.getElementById('Google');
    var btnFacebook = document.getElementById('Facebook');
    var btnTwitter = document.getElementById('Twitter');
    var connectGithub = document.getElementById('connectGithub');
    var connectLinkedin = document.getElementById('connectLinkedin');
    var connectInstagram = document.getElementById('connectInstagram');

    // Login blocks' events
    btnLogin.addEventListener('click', function() {
        var email = txtEmail.value;
        var password = txtPassword.value;

        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            console.log('Successfully login!!');
            create_alert('success', message)
            //window.location.href = 'chatroom.html';
        }).catch(function(error) {
            var errMes = error.message;
            console.log(errMes);
            create_alert("error", errMes);
            txtEmail.value = "";
            txtPassword.value = "";
        });
    });

    btnSignup.addEventListener('click', function() {
        // var email = txtEmail.value;
        // var pass = txtPassword.value;

        // firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
        //     create_alert("success", "");
        // }).catch(function(err) {
        //     var errMes = err.message;
        //     create_alert("error", errMes);
        //     txtEmail.value = "";
        //     txtPassword.value = "";
        // });

        window.location.href = "signup.html";
    });

    btnGoogle.addEventListener('click', function() {
        alert('google');
    });

    btnFacebook.addEventListener('click', function() {
        alert('fb');
    });

    btnTwitter.addEventListener('click', function() {
        alert('tw');
    });

    // Connect my personal web page
    connectGithub.addEventListener('click', function() {
        window.location.href = 'https://github.com/ChristianLin0420';
    });

    connectLinkedin.addEventListener('click', function() {
        window.location.href = 'https://www.linkedin.com/in/bor-jiun-lin-b99b80191/';
    });

    connectInstagram.addEventListener('click', function() {
        window.location.href = 'https://www.instagram.com/?hl=zh-tw';
    });
}

// Custom alert
function create_alert(type, message) {
    if (type == "success") {
        alert('Successfully sign in!!')
    } else if (type == "error") {
        alert('Cannot sign in!!')
    }
}