// var myName = prompt("Enter your name");

// function sendMessage() {
//     var message = document.getElementById('message').value;

//     firebase.database().ref("messages").push().set({
//         "sender": myName,
//         "message": message
//     });

    
//     return false;
// }


function addUser() {
    var newUser = document.getElementById('friendChatHistory');
    newUser.innerHTML += "<li>user1";
}