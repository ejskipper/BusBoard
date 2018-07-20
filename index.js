const request = require('request');
const readlineSync = require('readline-sync');

// Get LAT LON from POSTCODE
let postcode = readlineSync.question('Enter a postcode: ');
request(`https://api.postcodes.io/postcodes/${postcode}`, function(error, response, body) {
    if (error) {
        throw error;
    }


    const asJSON = JSON.parse(body);
    
    if (asJSON['status'] === 404) {
        console.log('Invalid postcode');
        return;
    }

    const latitude = asJSON['result']['latitude'];
    const longitude = asJSON['result']['longitude'];
    console.log(latitude, longitude);
});


const appId = '4586bfa0';
const appKey = '4236304488967b5683897c8980725377';
const stopId = '490008660N';
const requestURL = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_id=${appId}&app_key=${appKey}`;


request(requestURL, function (error, response, body) {
    if (error) {
        throw error;
    }
    const asJSON = JSON.parse(body);

    console.log(`The next 5 buses leaving from ${asJSON[1]['stationName']} are:`)
    const limit = 5;
    for (let i=0; i<limit; i++) {
        console.log(`${asJSON[i]['expectedArrival']} ${asJSON[i]['destinationName']}`);
    }
});

