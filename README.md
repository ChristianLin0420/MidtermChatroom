# Software Studio 2020 Spring Midterm Project

## Topic
* Project Name : [107062240_ChatRoom]
* Key functions (add/delete)
### chatroom.js
#### Using below arguments to retrive or update data stored in firebase
    var postsRef = firebase.database().ref('individuals');
    var chatsRef = firebase.database().ref('chats');
    var recordRef = firebase.database().ref('messages');
    
#### Below functions are used to preload or reload the UI according to the          change in firebase

1. ==reloadHistoryList==:
    This part is to show the friends list that current user has been added as friend.
```javascript=16
function reloadHistoryList() {
    var chat_history = document.getElementById('friendChatHistory');

    var total_post = [];
    var first_count = 0;
    var second_count = 0;

    chat_ley_list = [];

    chat_history.innerHTML = '';

    chatsRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();
            var key = data.key;
            
            .
            .
            . 

            first_count = total_post.length;
        }
    });
}
```

2. ==reloadChatRecord==:
    This part is to show the history on chat block, and the content is based on the friend that user chooses now.
```javascript=16
function reloadChatRecord(name) {
    if (name == null) { return; }

    var chat_block_img = document.getElementById('chatBlockUserImg');
    var chat_block_title = document.getElementById('userRecordLabel');
    var info_block_img = document.getElementById('friendImage');
    var info_block_title = document.getElementById('currentUser');
    var info_block_email = document.getElementById('emailLabel');
    var target = document.getElementById('chatRecord');

    chat_block_title.innerHTML = name;
    info_block_title.innerHTML = name;
    current_friend_name = name;
    
            .
            .
            .
    
                if (total_post != null) {
                    // Update chat record in the chat record block
                    for(var i = 0; i < total_post.length; i++) {
                        var userName = total_post[i].name;
                        var userMsg = total_post[i].message;

                        updateChatRecordBlock(userName, userMsg);
                    }
                }
            }
        }
    });
}
```

3. ==reloadNewFiendsList==:
    This part is to show members list that current user doesn't add as friend
```javascript=16
function reloadNewFiendsList(list) {
    var newList = document.getElementById('newFriendsList');

    newList.innerHTML = '';

    for (var i = 0; i < list.length; i++) {
        var imgURL = 'img/userImg.png';

        for(var j = 0; j < members_img_list.length; j++) {
            if(members_list[j] == list[i]) {
                imgURL = members_img_list[i];
            }
        }

        newList.innerHTML += "<li><img src=" + imgURL + "><h3>"+list[i]+"</h3><button id=Add"+ list[i] +" onclick='addNewFriendToChat(this.id)'>Add</button>";
    }
}
```

* Other functions
### index.js
1. ==Sign In / Up==:
```javascript=16
    // Below show the implementation for the sign up machanism
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
```

2. ==Connect to my website==:
```javascript=16
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
```



### signup.js
1. ==Choose gender==:
```javascript=16
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
```

### chatroom.js
1. ==html input issue==:
```javascript=16
function convertString(s) {
    var index = 0;
    var result = "";

    while(index < s.length) {
        if (s[index] == '<')
            result += "&lt;";
        else if (s[index] == '>')
            result += "&gt;";
        else if (s[index] == '\"')
            result += "&quot;";
        else if (s[index] == '\'')
            result += "&#039;";
        else if (s[index] == '\\')
            result += "&#092;";
        else if (s[index] == '&')
            result += "&amp;";
        else {
            result += s[index];
        }
        index += 1;
    }

    return result;
}
```

## Basic Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Membership Mechanism|15%|Y|
|Firebase Page|5%|Y|
|Database|15%|Y|
|RWD|15%|Y|
|Topic Key Function|20%|Y|

## Advanced Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Third-Party Sign In|2.5%|Y|
|Chrome Notification|5%|Y|
|Use CSS Animation|2.5%|Y|
|Security Report|5%|Y|

## Website Detail Description

# 作品網址：[https://web-midterm-project-chatroom.web.app]

