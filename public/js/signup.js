var gender = true; // man: true, female: false

function ContentMode() {
    var target = document.getElementById('userImg');
    gender = !gender;

    if (gender) {
        document.getElementById('fill').style.color =  "#28a5e4";
        document.getElementById('empty').style.color =  "#6f6f6f";
        target.src = 'https://i.imgur.com/uIiaHm5.jpg';
    } else {
        document.getElementById('fill').style.color =  "#6f6f6f";
        document.getElementById('empty').style.color =  "#fd3e7e";
        target.src = 'https://i.imgur.com/ZdIsJ5A.jpg';
    }
}

function InitSignup() { 
    var saveBtn = document.getElementById('saveButton');
    var userName = document.getElementById('usernameField');
    var userEmailBox = document.getElementById('emailTxt');
    var imgSelector = document.getElementById('uploadUserImg');
    var target = document.getElementById('userImg');

    var userEmail;
    var reader = new FileReader();

    imgSelector.addEventListener('change', function() {
        var file = this.files[0];
        var src = URL.createObjectURL(file);

        reader.onloadend = function() {
            //console.log(reader.result)
        }
        reader.readAsDataURL(file);
        
        target.src = src;
    });

    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            userEmail = user.email;
            userEmailBox.innerHTML = userEmail;
        } else {
            alert('There is no signin user!!!')
            window.location.href = 'index.html';
        }
    });

    var postsRef = firebase.database().ref('individuals');
    var total_post = [];
    var first_count = 0;
    var second_count = 0;
        
    postsRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();
            console.log(childData.email);
            total_post[total_post.length] = childData.name;
            first_count = total_post.length;
        }
    });

    // Save new user profile
    saveBtn.addEventListener('click', async function() {
        var imgURL = (gender) ? 'https://i.imgur.com/uIiaHm5.jpg' : 'https://i.imgur.com/ZdIsJ5A.jpg';

        if(userName.value != null) {

            var database = await firebase.database().ref('individuals').push({
                name : userName.value,
                email : userEmail,
                profileImg : imgURL,
                newFriends: total_post
            });

            first_count = 0;
            second_count = 0;

            postsRef.on('child_added', function(data) {
                second_count += 1;
                if (second_count > first_count) {
                    var childData = data.val();
                    var key = data.key;

                    if (childData.email != userEmail) {
                        var friends = childData.newFriends;
    
                        if (friends != null) {
                            friends.push(userName.value);
                            postsRef.child(key).child('newFriends').update(friends);
                        } else {
                            postsRef.child(key).update({
                                newFriends : [userName.value]
                            });
                        }    
                    }

                    first_count = total_post.length;
                }
            });

            window.location.href = 'chatroom.html';
        } else {
            alert('You need to fill in your username');
        }
    });
}

window.onload = function() {
    this.InitSignup();
}