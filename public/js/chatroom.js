
var postsRef = firebase.database().ref('individuals');
var chatsRef = firebase.database().ref('chats');
var recordRef = firebase.database().ref('messages');

var current_user_name;
var current_friend_name;
var userEmail;

var members_list = [];
var members_img_list = [];
var members_img_email = [];
var chat_ley_list = [];

var current_chat_record;
var current_chat_index;
var current_messages_key;
var current_chat_key;

// Set Timer to update chat block current bubble position
function updateScroll(){
    var element = document.getElementById("chatRecord");
    element.scrollTop = element.scrollHeight;
}

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

var isInput = false;

function AddCommend() {
    var newCommend = document.getElementById('sendMsg');

    if (current_friend_name == null) { 
        newCommend.value = '';
        return;
    }

    isInput = true;
    updateChatRecordBlock(current_user_name, newCommend.value);

    newCommend.value = '';
}

function updateChatRecordBlock(name, msg) {
    var target = document.getElementById('chatRecord');
    var commendLength = msg.length;

    if (commendLength > 0) {
        var lineCount = Math.floor(commendLength / 56);
        var txt = convertString(msg);
        if (lineCount < 0) { lineCount = 0; }

        var chatBubbleHeight = 8 + lineCount * 4;

        if (name == current_user_name) {
            target.innerHTML += "<li id='user2' style='height: " + chatBubbleHeight +"%'><span>" + txt;
        } else {
            target.innerHTML += "<li id='user1' style='height: " + chatBubbleHeight +"%'><img src='https://i.imgur.com/ZdIsJ5A.jpg'><span>" + txt;
        }

        if (current_chat_key != null) {
            console.log(current_chat_key);
            chatsRef.child(current_chat_key).child('latest_sentence').set(txt);
        }

        updateScroll();
        reloadHistoryList();

        if (isInput) {
            addNewMessagesToFirebase(txt);
        }

        isInput = false;
    }
}

function addNewFriendToChat(id) {
    var new_friend_name = id.substring(3);

    var total_post = [];
    var update_post = [];
    var new_update_post = [];
    var first_count = 0;
    var second_count = 0;
        
    postsRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();
            var key = data.key;

            // Delete new friend from list for current user
            if (userEmail == childData.email) {
                total_post = childData.newFriends;

                for(var i = 0; i < total_post.length; i++) {
                    if(total_post[i] != new_friend_name) {
                        update_post.push(total_post[i]);
                    }
                }

                reloadNewFiendsList(update_post);
                
                if (update_post.length > 0) {
                    postsRef.child(key).child('newFriends').set(update_post);
                } else {
                    postsRef.child(key).child('newFriends').remove();
                }
            }
        }
    });

    first_count = 0;
    second_count = 0;

    postsRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();
            var key = data.key;

            // Delete user from new friend's list 
            if (new_friend_name == childData.name) {
                total_post = childData.newFriends;

                for(var i = 0; i < total_post.length; i++) {
                    if(total_post[i] != current_user_name) {
                        new_update_post.push(total_post[i]);
                    }
                }
                
                if (update_post.length > 0) {
                    postsRef.child(key).child('newFriends').set(new_update_post);
                } else {
                    postsRef.child(key).child('newFriends').remove();
                }

                var today = new Date();
                var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
                var time = (today.getHours()) + ":" + today.getMinutes();
                var dateTime = date+' '+time; 

                // Add new members property in firebase
                var database = firebase.database().ref('chats').push({
                    member_1 : new_friend_name,
                    member_2 : current_user_name,
                    time: dateTime, 
                    latest_sentence: ''
                });

                var msg_record_database = firebase.database().ref('messages').push({
                    member_1 : new_friend_name,
                    member_2 : current_user_name
                });

                reloadHistoryList();
            }
        }
    });
}

function addNewMessagesToFirebase(newMessage) {

    var total_post = [];
    var first_count = 0;
    var second_count = 0;

    recordRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();
            var key = data.key;

            if (current_user_name == childData.member_1 && current_friend_name == childData.member_2) {
                total_post = childData.messagesRecord;

                // Update chat record in the chat record block
                if(total_post != null) {
                    total_post.push({
                        name : current_user_name,
                        message : newMessage
                    });
                    recordRef.child(key).child('messagesRecord').update(total_post);
                } else {
                    total_post = [{
                        name : current_user_name,
                        message : newMessage
                    }];
                    recordRef.child(key).update({
                        messagesRecord : total_post
                    });
                }
            }

            if (current_user_name == childData.member_2 && current_friend_name == childData.member_1) {
                total_post = childData.messagesRecord;

                // Update chat record in the chat record block
                if(total_post != null) {
                    total_post.push({
                        name : current_user_name,
                        message : newMessage
                    });
                    recordRef.child(key).child('messagesRecord').update(total_post);
                } else {
                    total_post = [{
                        name : current_user_name,
                        message : newMessage
                    }];
                    recordRef.child(key).update({
                        messagesRecord : total_post
                    });
                }
            }
        }
    });
}

// All functions below will be reloaded while the user add new message or friend in the firebase
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

            console.log('2');

            if (childData.member_1 == current_user_name) {
                var imgURL = 'img/userImg.png';

                for(var i = 0; i < members_img_list.length; i++) {
                    if(members_list[i] == childData.member_2) {
                        imgURL = members_img_list[i];
                        break;
                    }
                }

                chat_ley_list.push(key);
                console.log('asdfasdf');
                console.log(chat_ley_list.length);

                chat_history.innerHTML += "<li id=" + childData.member_2 + " onclick='reloadChatRecord(this.id)'><img src=" + imgURL + "><span>" + childData.member_2 + "</span><h3>" + childData.latest_sentence + "</h3><h4>" + childData.time;
            } else if (childData.member_2 == current_user_name) {
                var imgURL = 'img/userImg.png';

                for(var i = 0; i < members_img_list.length; i++) {
                    if(members_list[i] == childData.member_1) {
                        imgURL = members_img_list[i];
                        break;
                    }
                }

                chat_ley_list.push(key);

                chat_history.innerHTML += "<li id=" + childData.member_1 + " onclick='reloadChatRecord(this.id)'><img src=" + imgURL + "><span>" + childData.member_1 + "</span><h3>" + childData.latest_sentence + "</h3><h4>" + childData.time;
            }

            first_count = total_post.length;
        }
    });
}

function reloadChatRecord(name) {

    console.log(name);
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

    var total_post = [];
    var first_count = 0;
    var second_count = 0;

    target.innerHTML = '';

    recordRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();
            var key = data.key;

            if (current_user_name == childData.member_1 && name == childData.member_2) {
                current_messages_key = key;
                current_friend_name = name;
                total_post = childData.messagesRecord;

                var imgURL = 'img/userImg.png';

                for(var i = 0; i < members_img_list.length; i++) {
                    if(members_list[i] == name) {
                        imgURL = members_img_list[i];
                        info_block_email.innerHTML = members_img_email[i];
                        chat_block_img.src = imgURL;
                        info_block_img.src = imgURL;
                        current_chat_key = chat_ley_list[second_count - 1];
                        console.log(current_chat_key);
                        break;
                    }
                }

                if (total_post != null) {
                    // Update chat record in the chat record block
                    for(var i = 0; i < total_post.length; i++) {
                        var userName = total_post[i].name;
                        var userMsg = total_post[i].message;

                        updateChatRecordBlock(userName, userMsg);
                    } 
                }
            }

            if (current_user_name == childData.member_2 && name == childData.member_1) {
                current_messages_key = key;
                current_friend_name = name;
                total_post = childData.messagesRecord;

                var imgURL = 'img/userImg.png';

                for(var i = 0; i < members_img_list.length; i++) {
                    if(members_list[i] == name) {
                        imgURL = members_img_list[i];
                        info_block_email.innerHTML = members_img_email[i];
                        chat_block_img.src = imgURL;
                        info_block_img.src = imgURL;
                        current_chat_key = chat_ley_list[second_count - 1];
                        console.log(current_chat_key);
                        break;
                    }
                }

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

function startUpdateFirebase() {
    reloadChatRecord(current_friend_name);
}

function startUpdate() {
    setInterval(startUpdateFirebase, 2000);
}

function InitialChatroom() {
    updateScroll();

    var logoutBtn = document.getElementById('logout');
    var userRecordLabel = document.getElementById('userRecordLabel');
    var emailLabel = document.getElementById('emailLabel');
    var userNameLabel = document.getElementById('currentUser');
    var chat_history = document.getElementById('friendChatHistory');

    firebase.auth().onAuthStateChanged(function(user) { 
        if (user) {
            userEmail = user.email;
        } else {
            window.location.href = 'index.html';
        }
    });

    var total_post = [];
    var first_count = 0;
    var second_count = 0;
        
    postsRef.on('child_added', function(data) {
        second_count += 1;
        if (second_count > first_count) {
            var childData = data.val();

            members_list.push(childData.name);
            members_img_list.push(childData.profileImg);
            members_img_email.push(childData.email);

            console.log('0');

            if (userEmail == childData.email) {
                total_post = childData.newFriends;
                current_user_name = childData.name;

                if (total_post != null) {
                    reloadNewFiendsList(total_post);
                }
            }
        }
    });

    reloadHistoryList();

    if (userEmail != null) {
        emailLabel.innerHTML = userEmail;
    }

    if (current_user_name != null) {
        userNameLabel.innerHTML = current_user_name;
        userRecordLabel.innerHTML = current_user_name;
    }

    logoutBtn.addEventListener('click', function() {
        firebase.auth().signOut().then(function() {
            alert('Logout is successful!');
            window.location.href = 'index.html';
        }).catch(function(error) {
            alert('Logout is failed!');
        });
    });

    setTimeout(startUpdate, 5000);
}

window.onload = function() {
    this.InitialChatroom();    
}
