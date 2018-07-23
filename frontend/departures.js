
function getBusTimes() {
    var xhttp = new XMLHttpRequest();

    var postcode = document.forms[0].elements["postcodeField"].value;

    xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);
    
    xhttp.setRequestHeader('Content-Type', 'application/json');
    
    xhttp.onload = function() {
        // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText

        if (xhttp.status === 200) {
            let busTimesAsJSON = JSON.parse(xhttp.responseText);

            if (xhttp.responseText === '[]') {
                // Give a message if there are no bus results
                document.getElementById('results').innerHTML = '<h2>Results</h2>No buses';
                return;
            }

            let busTimesHTML = busTimesAsJSON.map(stop => {
                let stopName = stop.stopName;
                let direction = stop.direction;
                
                let busTimes = stop.buses.map((bus) => {
                    return `<li>${bus.time} to ${bus.destination}</li>`;
                }).join('');
                
                return `<h3>${stopName}, ${direction}</h3>
                        <ul>${busTimes}</ul>`;
                
            });
            
            let resultsHTML = `<h2>Results</h2>${busTimesHTML.join('')}`
            document.getElementById('results').innerHTML = resultsHTML;
        } else {
            let resultsHTML = `<h2>Results</h2>${xhttp.responseText}`
            document.getElementById('results').innerHTML = resultsHTML;
        }
    }
    
    xhttp.send();
}