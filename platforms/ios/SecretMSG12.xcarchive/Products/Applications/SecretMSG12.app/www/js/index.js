// <<<-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= TO DO LIST =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=->>>
//
//  -   Encode message in the picture
//  -   Be able to decode the message
//  -   ... Double check for anything missing?
//  -   Kill the bugs and shit
//  -   Test on an iPhone and shit
//  -   Debug again..
//  -   Test again and hope that it works
//  -   Profit.

let msgImg = document.createElement('img');
let index = -1;

msgImg.crossOrigin = "Anonymous";

let userData = [];
let serverData = [];
let formdata = null;
let errMsg = true;

let userName = null;
let userMail = null;
let userID = "";
let userGUID = null;
let messages = null;
let msgName = null;

serverData = {
    httpRequest: "POST",
    getJSON: function () {     
        
        fetch(serverData.url, {
            method: serverData.httpRequest,
            mode: "cors",
            body: formdata
        })
        .then(function (response) {
//              console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            
            if (data.code != 0) {
                errMsg = true;
                console.log(errMsg);
                document.querySelector(".errMsg").textContent = data.message;
            }
            else {
                errMsg = false;
                console.log(errMsg);
                importData(data);
            }
            
        })
        .catch(function (err) {
            alert("Error: " + err.message);
        });
    }
}

if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady); // This is a device.
}
else {
    document.addEventListener('DOMContentLoaded', onDeviceReady); // This is without a device.
}

function onDeviceReady() {
    console.log("App initiated!");
//    alert("App initiated!");
    setLogin();
}

function importData(data) {
    userData = data;
    
    if (userData.user_id != null && userData.user_guid != null) {
        userID = userData.user_id;
        userGUID = userData.user_guid;
    }
    else if(userData.messages) {
        messages = userData.messages;
    }
}

function msgList() {
    console.log("Messages Loading..");
    console.log(messages);
    
    document.getElementById("msg-page").classList.add("active");
    let ul = document.getElementById("msg-list");
    ul.innerHTML = "";
    if (messages.length == 0) {
        console.log("No messages.. :c")
    }
    else {
        messages.forEach(function (value) {
            
            let li = document.createElement("li");
            li.className = "table-view-cell";
            li.setAttribute("msg-id", value.msg_id);
            li.addEventListener("click", msgView);
            
            let aa = document.createElement("a");
            aa.className = "navigate-right";
            
            let span1 = document.createElement("span");
            let h2 = document.createElement("h2");
            let pp = document.createElement("p");
            h2.textContent = value.user_name;
            pp.textContent = "New message";
            
            console.log(value.msg_id);
            
            let span2 = document.createElement("a");
            span2.className = "navigate-right";
            
            ul.appendChild(li);
            li.appendChild(aa);
            aa.appendChild(span1);
            span1.appendChild(h2);
            span1.appendChild(pp);
            
        });
    }
}

function setLogin() {
    
    console.log("Setting buttons..");
    
    document.querySelector("#username").value = "";
    document.querySelector("#useremail").value = ""; // <- !!IMPORTANT!! CHANGE VALUES
    
    let logBtn = document.querySelector(".login");
    logBtn.addEventListener("click", login);
    
    let regBtn = document.querySelector(".register");
    regBtn.addEventListener("click", register);
    
    let newBtn = document.querySelector(".msgNew");
    newBtn.addEventListener("click", msgCreate);
    
    let frshBtn = document.querySelector(".msgRere");
    frshBtn.addEventListener("click", msgLoad);
    
    let delBtn = document.querySelector(".msgDelete");
    delBtn.addEventListener("click", msgDelete);
    
    let camBtn = document.querySelector(".msgPic");
    camBtn.addEventListener("click", msgPic);
    
    let canBtn = document.querySelectorAll(".msgCancel");
    for (var i = 0; i < canBtn.length; i++){
        canBtn[i].addEventListener("click", msgCancel);
    }
    console.log("Buttons set!");
}

function register(ev) {
    ev.preventDefault();
    
    console.log("Attempting to register..");
    
    if (document.querySelector("#username").value == "" || document.querySelector("#useremail").value == "") {
        alert("You need to fill out ALL the fields.");
        console.log("Failed to register.");
    }
    else {
        userName = document.getElementById("username").value;
        userMail = document.getElementById("useremail").value;
        
        formdata = new FormData();
        formdata.append("user_name", userName);
        formdata.append("email", userMail);
        serverData.url = "https://griffis.edumedia.ca/mad9022/steg/register.php"
        serverData.getJSON();
        setTimeout(function() {
            if (errMsg != true) {
                msgLoad();
            }
        },500);
    }
}
function login(ev) {
    ev.preventDefault();
    
    console.log("Attempting to login..");
    
    if (document.querySelector("#username").value == "" || document.querySelector("#useremail").value == "") {
        document.querySelector(".errMsg").textContent = "Missing username/e-mail.";
        console.log("Failed to login.");
    }
    else {
        userName = document.getElementById("username").value;
        userMail = document.getElementById("useremail").value;
        
        formdata = new FormData();
        formdata.append("user_name", userName);
        formdata.append("email", userMail);
        serverData.url = "https://griffis.edumedia.ca/mad9022/steg/login.php"
        serverData.getJSON();
        setTimeout(function() {
            if (errMsg != true) {
                msgLoad();
            }
        },500);
    }
}

function msgLoad() {
    console.log("Login success!");
    
    console.log(userID);
    console.log(userGUID);
    
    formdata = new FormData();
    formdata.append("user_id", userID);
    formdata.append("user_guid", userGUID);
    serverData.url = "https://griffis.edumedia.ca/mad9022/steg/msg-list.php"
    serverData.getJSON();
    
    setTimeout(function() {
        if (errMsg != true) {
            msgList();
        }
    },300);
}

function usrList() {
    console.log("Loading user list..")
    formdata = new FormData();
    formdata.append("user_id", userID);
    formdata.append("user_guid", userGUID);
    serverData.url = "https://griffis.edumedia.ca/mad9022/steg/user-list.php"
    serverData.getJSON();
    
    setTimeout(function() {
        let userList = userData.users;
        console.log(userList);
        
        let usrDrop = document.getElementById("user-list");
        usrDrop.innerHTML = "";
        userList.forEach(function (value) {
            
            let option = document.createElement("option");
            option.setAttribute("value", value.user_id);
            option.textContent = value.user_name;
            
            usrDrop.appendChild(option);
            
        });
        
        console.log("User list loaded!");
    },300);
}

function msgCreate(ev) {
    console.log("Creating message..");
    ev.preventDefault();
    index = -1;
    
    usrList();
    
    msgImg.src = "#";
    console.log(msgImg.src);
    var c = document.getElementById("createMsg");
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    console.log("Canvas cleared!");
    
    document.getElementById("msg-new").classList.add("active");
    document.querySelector("#message").value = "";
    document.querySelector(".msgSend").addEventListener("click", msgSend);
}

function msgCancel() {
    console.log("Canceling shit.");
    
    msgImg.src = "#";
    console.log(msgImg.src);
    var c = document.getElementById("viewMsg");
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    console.log("Canvas cleared!");
    
    document.getElementById("msg-new").classList.remove("active");
    document.getElementById("msg-view").classList.remove("active");
    document.querySelector("#message").value = "";
    document.querySelector(".msgSend").removeEventListener("click", msgSend);
}

function msgSend() { // <- Broken rn, work on that later
   // ev.preventDefault();
//    console.log(msgImg.src);
    if (document.querySelector("#message").value == "" || msgImg.src == "") {
        alert("You need to fill out ALL the fields.");
    }
    else {
        let userChoice = document.getElementById("user-list").value;
        let userMsg = document.querySelector("#message").value;
        
        let canvas = document.getElementById("createMsg");
        let ctx = canvas.getContext('2d');
        let codedID = BITS.numberToBitArray(userChoice);
        let codedMSG = BITS.stringToBitArray(userMsg);
        let codedLNTH = BITS.numberToBitArray(codedMSG.length);
        
        
        BITS.setUserId(codedID, canvas);
        BITS.setMessage(codedMSG, canvas);
        BITS.setMsgLength(codedLNTH, canvas);
        
        
//        console.log("Convertion success?");
        
        let dataURL = canvas.toDataURL();

        dataURLToBlob(dataURL)
        
            .then(function(blob){
            
            console.log(userMsg);
            
//            console.log(userID);
//            console.log(userGUID);
            console.log(userChoice);
            console.log(blob);
            
            formdata = new FormData();
            formdata.append("user_id", userID);
            formdata.append("user_guid", userGUID);
            formdata.append("recipient_id", userChoice);
            formdata.append("image", blob);
            serverData.url = "https://griffis.edumedia.ca/mad9022/steg/msg-send.php"
            serverData.getJSON();
            
        });
        
        document.getElementById("msg-new").classList.remove("active");
        document.querySelector(".msgSend").removeEventListener("click", msgSend);
        
        setTimeout(function() {
            msgLoad();
        },500);
        
    }
}

function msgPic() {
    addPicture();
    console.log("Loading camera..")
}

function msgView(ev) {
    console.log(messages.msg_id);
    
    ev.preventDefault();
    let li = ev.currentTarget;
    console.log(li.querySelector("h2").textContent + li.getAttribute("msg-id"));
    let senderName = li.querySelector("h2").textContent + li.getAttribute("msg-id");
    index = -1;
    for (let i = 0; i < messages.length; i++) {
        if ((messages[i].user_name + messages[i].msg_id) == senderName) {
            msgName = messages[i].user_name;
            index = i;
            console.log(index);
            break;
        }
    }
    
    formdata = new FormData();
    formdata.append("user_id", userID);
    formdata.append("user_guid", userGUID);
    formdata.append("message_id", messages[index].msg_id);
    serverData.url = "https://griffis.edumedia.ca/mad9022/steg/msg-get.php"
    serverData.getJSON();
    
    // << - MESSAGE DECODING HERE - >>
    setTimeout(function() {
        let pictureData = userData.image;
        
        console.log(pictureData);
        
        msgImg.src = "https://griffis.edumedia.ca/mad9022/steg/" + pictureData;
        var canvas = document.getElementById("viewMsg");
        var ctx = canvas.getContext('2d');
        msgImg.addEventListener('load', function(ev){
            console.log("Image loaded.");
            ctx.drawImage(msgImg, 0, 0);
            console.log(BITS.getUserId(canvas));
            console.log(userID);
            let setMSG = BITS.getMessage(userID, canvas);
            document.querySelector(".picMessage").textContent = msgName + ": " + setMSG;
//            console.log(setMSG);
        });
    }, 300);
    
    document.getElementById("msg-view").classList.add("active");
}
function msgDelete() {
    formdata = new FormData();
    formdata.append("user_id", userID);
    formdata.append("user_guid", userGUID);
    formdata.append("message_id", messages[index].msg_id);
    serverData.url = "https://griffis.edumedia.ca/mad9022/steg/msg-delete.php"
    serverData.getJSON();
    document.getElementById("msg-view").classList.remove("active");
    msgLoad();
}

function addPicture() {
    console.log("Loading camera.");
    
    var options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        pictureSourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        targetWidth: 300,
        targetHeight: 300
    }
    
    navigator.camera.getPicture(onSuccess, onFail, options);
}

function onSuccess(imageData) {
//    msgImg.src = "data:image/png;base64," + imageData; //
    msgImg.src = imageData; //
    var c = document.getElementById("createMsg");
    var ctx = c.getContext('2d');
    msgImg.addEventListener('load', function(ev){
        console.log("Image loaded.");
        ctx.drawImage(msgImg, 0, 0);
    });
    console.log(msgImg.src);
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function dataURLToBlob(dataURL) {
 return Promise.resolve().then(function () {
   var type = dataURL.match(/data:([^;]+)/)[1];
   var base64 = dataURL.replace(/^[^,]+,/, '');
   var buff = binaryStringToArrayBuffer(atob(base64));
   return new Blob([buff], {type: type});
 });
}

function binaryStringToArrayBuffer(binary) {
 var length = binary.length;
 var buf = new ArrayBuffer(length);
 var arr = new Uint8Array(buf);
 var i = -1;
 while (++i < length) {
   arr[i] = binary.charCodeAt(i);
 }
 return buf;
}