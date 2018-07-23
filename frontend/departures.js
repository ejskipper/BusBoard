
function getBusTimes() {
    var xhttp = new XMLHttpRequest();

    var postcode = document.forms[0].elements["postcodeField"].value;

    xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);
    
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
                    var stopName = stop.stopName;
                    var direction = stop.direction;
                    
                    var busTimes = stop.buses.map((bus) => {
                        return `<li>${bus.time} to ${bus.destination}</li>`;
                    }).join('');
                    
                    return `<h3>${stopName}, ${direction}</h3>
                            <ul>${busTimes}</ul>`;
                    
                });
            }
            
            resultsHTML += busTimesHTML.join('');
        } else {
            resultsHTML += xhttp.responseText;
        }

        document.getElementById('results').innerHTML = resultsHTML;
    }
    
    xhttp.send();
}