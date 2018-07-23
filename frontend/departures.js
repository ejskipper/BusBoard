function getBusTimes() {
    var xhttp = new XMLHttpRequest();
    console.log('call getBustimes');

    var postcode = document.forms[0].elements["postcodeField"].value;
    console.log(postcode);

    xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);
    
    xhttp.setRequestHeader('Content-Type', 'application/json');
    
    xhttp.onload = function() {
        // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
        console.log(xhttp.status);
        console.log(xhttp.response);
        console.log(xhttp.responseText);
    }
    
    xhttp.send();
}