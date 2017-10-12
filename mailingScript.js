var URL = "http://lschallengesp2.azurewebsites.net/api/";
var topicList = [];//["Entertainment","Sport","Shopping","Technology","Business"];
var topicIds = [];

function postRecord() {
    console.log(topicList);
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
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
        //document.getElementById("firstName").value = '';
        //document.getElementById("lastName").value = '';
        //document.getElementById("email").value = '';
    } else {
        alert("Make sure you have filled in all fields and selected at least one topic.");
    }
}

function getRecord() {
	document.getElementById("result").innerHTML = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            for (var i = 0; i < response.length; i++) {
                var current = response[i]; 
                document.getElementById("result").innerHTML += current.firstName + " " + current.lastName + " | " + current.email + "<br> ";
            }
        }
    };
    xhttp.open("GET", URL + "getUsers", true);
    xhttp.send();
}

function getTopics() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            for (var i = 0; i < response.length; i++) {
                var current = response[i]; 
                topicList[i] = current.topicName;
                topicIds[i] = current.id;
            }
            generateTopicList();
        }
    };
    xhttp.open("GET", URL + "getTopics", true);
    xhttp.send();
}

function generateTopicList() {
    for (var i = 0, j = topicList.length; i < j; i++) {
        var topic = topicList[i];
        var topicId = topicIds[i];
        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        var description = document.createTextNode(topic);
        var br = document.createElement("br");

        checkbox.type = "checkbox";
        checkbox.name = "topicBox" + i;
        checkbox.id = "topicBox" + i;
        checkbox.value = topicId;
        

        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);
        label.appendChild(br);

        document.getElementById('checkboxDiv').appendChild(label);
    }
}