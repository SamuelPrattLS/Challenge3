var URL = "http://lschallengesp2.azurewebsites.net/api/getUsers";

function calculate() {
	alert("nothing heppened...");
}

function postToAlt(newUrl) {
	URL = newUrl;
	postRecord();
	URL = "http://lschallengesp2.azurewebsites.net/api/getUsers";
}

function getFromAlt(newUrl) {
	URL = newUrl;
	getRecord();
	URL = "http://lschallengesp2.azurewebsites.net/api/getUsers";
}

function postRecord() {
    var name = document.getElementById("inputBox").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("result").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", URL + "?username=" + name, true);
    xhttp.send();
}

function getRecord() {
	document.getElementById("result").innerHTML = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            for (var i = 0; i < response.length; i++) {
              document.getElementById("result").innerHTML += response[i].name + "<br> ";
            }
        }
    };
    xhttp.open("GET", URL, true);
    xhttp.send();
}