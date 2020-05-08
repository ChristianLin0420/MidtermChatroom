// Activate clock
var interval = setInterval(clock, 1000);


var postsRef = firebase.database().ref('individuals');

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
    var txtEmail = document.getElementById('Emailfield');
    var txtPassword = document.getElementById('Password');
    var btnLogin = document.getElementById('SignIn');
    var btnSignup = document.getElementById('SignUp');
    var btnGoogle = document.getElementById('Google');
    var connectGithub = document.getElementById('connectGithub');
    var connectLinkedin = document.getElementById('connectLinkedin');
    var connectInstagram = document.getElementById('connectInstagram');

    // Login blocks' events
    btnLogin.addEventListener('click', function() {
        var email = txtEmail.value;
        var password = txtPassword.value;

        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            create_alert('success', 'message');

            var user = firebase.auth().currentUser;

            window.location.href = "chatroom.html";
        }).catch(function(error) {
            var errMes = error.message;
            create_alert("error", errMes);
            txtEmail.value = "";
            txtPassword.value = "";
        });
    });

    // Create a new account in firebase and link to signup page
    btnSignup.addEventListener('click', function() {
        var email = txtEmail.value;
        var password = txtPassword.value;

        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
                create_alert('success', 'message');
                window.location.href = "signup.html";
            }).catch(function(error) {
                var errMes = error.message;
                create_alert("error", errMes);
                txtEmail.value = "";
                txtPassword.value = "";
            });
        }).catch(function(err) {
            var errMes = err.message;
            create_alert("error", errMes);
            txtEmail.value = "";
            txtPassword.value = "";
        });
    });

    btnGoogle.addEventListener('click', function() {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function(result) {
            var user = result.user;
            var email = user.email;

            var first_count = 0;
            var second_count = 0;

            //Need to checkout whether this account is new one or saved!!!
            postsRef.on('child_added', function(data) {
                if (data == null) {
                    window.location.href = "signup.html";
                }

                second_count += 1;
                if (second_count > first_count) {
                    var childData = data.val();

                    if (email == childData.email && email != null) {
                        create_alert("success", "success connect Google")
                        window.location.href = 'chatroom.html';
                    }
                }
            });

            window.location.href = "signup.html";
        }).catch(function(error) {
            var errorMessage = error.message;
            create_alert("error", errorMessage);
        });
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

window.onload = function() {
    initLogin();
}