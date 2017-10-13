var URL = "http://lschallengesp2.azurewebsites.net/api/";
var topicList = [];//["Entertainment","Sport","Shopping","Technology","Business"];
var topicIds = [];
var users = [];
var userIdList = [];

function postRecord() {
    console.log(topicList);
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value.toLowerCase();
    var topics = [];
    for (var i = 0; i < topicList.length; i++) {
        var checkbox = document.getElementById("topicBox" + i)
        if (checkbox.checked) {
            topics.push(checkbox.value);
        }
    }


    if (firstName != '' && lastName != '' && email != '' && topics.length > 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                getRecord();
            }
        };
        console.log(topics.join());
        xhttp.open("POST", URL + "getUsers" 
            + "?firstname=" + firstName 
            + "&lastname=" + lastName  
            + "&email=" + email 
            + "&topics=" + topics.join(), true);
        xhttp.send();

        // reset fields
        document.getElementById("firstName").value = '';
        document.getElementById("lastName").value = '';
        document.getElementById("email").value = '';
    } else {
        alert("Make sure you have filled in all fields and selected at least one topic.");
    }
}

function getRecord() {
	//document.getElementById("result").innerHTML = "Loading users...";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            users = [];
            userIdList = [];
            var response = JSON.parse(this.responseText);
            if (response.length == 0) {
                //document.getElementById("result").innerHTML = "No users found!";
            } else {
                for (var i = 0; i < response.length; i++) {
                    var user = response[i]; 
                    if (!userIdList.includes(user.id)) {

                        // put the current user into the users array if they are not already there
                        users.push({firstName:user.firstName, lastName:user.lastName, email:user.email, topics:[user.topicName]});
                        userIdList.push(user.id);

                    } else {

                        // if the user exists in the users array, add the new topic to the existing record
                        users[userIdList.indexOf(user.id)].topics.push(user.topicName);

                    }      
                }
                displayUsers();
            }
        }
    };
    xhttp.open("GET", URL + "getUsers", true);
    xhttp.send();
}

function getTopics(isAdmin) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            for (var i = 0; i < response.length; i++) {
                var current = response[i]; 
                topicList[i] = current.topicName;
                topicIds[i] = current.id;
            }
            generateTopicList(isAdmin);
        }
    };
    xhttp.open("GET", URL + "getTopics", true);
    xhttp.send();
}

function postTopic() {
    var newTopic = document.getElementById("newTopic").value;
    if (!topicList.includes(newTopic)) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                getTopics(true);
            }
        };
        xhttp.open("POST", URL + "getTopics" + "?topic=" + newTopic, true);
        xhttp.send();
    } else {
        alert("That topic already exists!");
    }
}
function generateTopicList(isAdmin) {
    document.getElementById('topicDiv').innerHTML = '';

    for (var i = 0, j = topicList.length; i < j; i++) {
        var topic = topicList[i];
        var topicId = topicIds[i];
        var label = document.createElement("label");
        var description = document.createTextNode(topic);
        var br = document.createElement("br");

        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = "topicBox" + i;
        checkbox.id = "topicBox" + i;
        checkbox.value = topicId;

        if(isAdmin) {
            //checkbox.onclick = displayUsers();
        }

        label.appendChild(checkbox);   // add the box to the element
        

        label.appendChild(description);
        label.appendChild(br);

        document.getElementById('topicDiv').appendChild(label);
    }
}

function displayUsers() {
    //document.getElementById("result").innerHTML = '';

    var table = document.getElementById("usersDiv");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }



    var topics = [];
    for (var i = 0; i < topicList.length; i++) {
        var checkbox = document.getElementById("topicBox" + i)
        if (checkbox.checked) {
            topics.push(topicList[i]);
        }
    }

    for (var i = 0, j = users.length; i < j; i++) {       
        var user = users[i];

        if (arrayContainsAnotherArray(user.topics,topics)) {

            var tr = document.createElement("tr");
            var nametd = document.createElement("td");
            var emailtd = document.createElement("td");
            var topicstd = document.createElement("td");

            nametd.innerHTML = user.firstName + " " + user.lastName;
            emailtd.innerHTML = user.email;
            topicstd.innerHTML = user.topics.join(', ');

            tr.appendChild(nametd);
            tr.appendChild(emailtd);
            tr.appendChild(topicstd);

            table.appendChild(tr)
            //document.getElementById("result").innerHTML += user.firstName + " " + user.lastName + " - " + user.email + " - Topics: " + user.topics.join(', ') + "<br> ";
        
        }
    }
}

function arrayContainsAnotherArray(array1, array2){
  for(var i = 0; i < array2.length; i++){
    if(array1.indexOf(array2[i]) === -1)
       return false;
  }
  return true;
}

function login() {
    var userName = document.getElementById("userName").value.toLowerCase();;
    var password = document.getElementById("password").value;

    if (userName == "admin" && password == "password") {
        window.location.href = "admin.html";
    }
    else {
        document.getElementById("error").innerHTML = "*The username and password you have entered are incorrect";
    }
}

function unsubscribe(){
    var email = document.getElementById("email").value.toLowerCase();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "removed.html";
        }
    };
    xhttp.open("DELETE", URL + "getUsers" + "?email=" + email, true);
    xhttp.send();

//It would be good to add in something that checks whether the name exists first before deleting. So a GET to check if the value exists, and an error if it doesn't. 

}

function loginPage(){
    window.location.href = "login.html";
}