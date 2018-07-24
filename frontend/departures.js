let id = 0;

function doFormSubmit() {
    clearInterval(id);

    // So that the every-30-second bus time updates continue using the same postcode on which they were originally called
    // Save postcode as a variable, and pass to setInterval.
    // clearInterval (above) will cancel the previous bus time update prescription when the form is next submitted
    var postcode = document.forms[0].elements["postcodeField"].value;
    getBusTimes(postcode);
    id = setInterval(() => getBusTimes(postcode), 10000)
}

function getBusTimes(postcode) {
    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', `/departureBoards?postcode=${postcode}`, true);
    
    xhttp.setRequestHeader('Content-Type', 'application/json');
    
    xhttp.onload = function() {
        // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
        var resultsHTML = '<h2>Results</h2>';
        
        if (xhttp.status === 200) {
            var busTimesAsJSON = JSON.parse(xhttp.responseText);

            if (xhttp.responseText === '[]') {
                resultsHTML += 'No buses';
            } else {
                var busTimesHTML = busTimesAsJSON.map(stop => {
                    var busTimes = stop.buses.map((bus) => {
                        return `<li>${bus.time} to ${bus.destination}</li>`;
                    }).join('');
                    
                    return `<h3>${stop.stopName}, ${stop.direction}</h3>
                            <ul>${busTimes}</ul>`;
                });
                resultsHTML += busTimesHTML.join('');
            }
            
        } else {
            // express may send a 400 Client Bad Data with an error message, return to client
            resultsHTML += xhttp.responseText;
        }

        document.getElementById('results').innerHTML = resultsHTML;
    }
    
    xhttp.send();
}