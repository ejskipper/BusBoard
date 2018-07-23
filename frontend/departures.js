
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
        let busTimesAsJSON = JSON.parse(xhttp.responseText);

        let busTimesHTML = busTimesAsJSON.map(stop => {
            let stopName = stop.stopName;
            let direction = stop.direction;
            
            let busTimes = stop.buses.map((bus) => {
                return `<li>${bus.time} to ${bus.destination}</li>`;
            }).join('');

            console.log(busTimes);
            

            // <h3>Example stop 1</h3>
            // <ul>
            //     <li>2 minutes: 123 to Example Street</li>
            //     <li>3 minutes: 456 to Fantasy Land</li>
            // </ul>
            return `<h3>${stopName}, ${direction}</h3>
                    <ul>${busTimes}</ul>`;
            
        });
        
        let resultsHTML = `<h2>Results</h2>${busTimesHTML.join('')}`
        document.getElementById('results').innerHTML = resultsHTML;
    }
    
    xhttp.send();
}