
function getBusTimes() {
    var xhttp = new XMLHttpRequest();

    var postcode = document.forms[0].elements["postcodeField"].value;

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