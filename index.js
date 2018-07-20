const request = require('request');
const readlineSync = require('readline-sync');

// API Credentials
const appId = '4586bfa0';
const appKey = '4236304488967b5683897c8980725377';            

// Get LAT LON from POSTCODE
// Prompt user
let postcode = readlineSync.question('\nEnter a postcode: ');

// create promise for postcode
let postCodePromise = new Promise(function(resolve, reject) {  
    // Request the postcode
    // If get lat lon... proceed with lat lon
    request(`https://api.postcodes.io/postcodes/${postcode}`, function(error, response, body) {
        if (error) {
            throw error;
        }
    
        const postcodeInfoAsJSON = JSON.parse(body);
    
        // Handle user entering garbage postcode
        if (postcodeInfoAsJSON['status'] === 404) {
            reject('Invalid postcode');
        }
    
        // Extract postcode lat lon
        const latitude = postcodeInfoAsJSON['result']['latitude'];
        const longitude = postcodeInfoAsJSON['result']['longitude'];
        resolve({latitude, longitude});
    });
});

postCodePromise.then((val) => (getStopPoints(val.latitude, val.longitude)),
                     (err) => console.log(err));

 function getStopPoints(latitude, longitude) {
    const radius = 1000; 
    const busStopURL = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopPair&radius=${radius}&lat=${latitude}&lon=${longitude}`;   

    request(busStopURL, function(error, response, body) {
        const stopPointsAsJSON = JSON.parse(body);

        // Get first two closests bus stops
        stopPointsAsJSON['stopPoints'].slice(0,2).forEach(function(stop) {
            stop['lineGroup'].forEach(function(directedStop) {
                const stopId = directedStop['naptanIdReference'];
                const requestURL = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_id=${appId}&app_key=${appKey}`;

                // Get bus times from this stop
                request(requestURL, function (error, response, body) {
                    if (error) {
                        throw error;
                    }

                    const busTimeAsJSON = JSON.parse(body);
                    if (busTimeAsJSON.length === 0) {
                        console.log(`No bus data found for stop id ${stopId}`);
                        return;
                    } 
                    console.log(`\nThe next 5 buses departing from ${stop['commonName']} are:`);
                    // Get first 5 buses and print their info
                    busTimeAsJSON.slice(0,5).forEach(function(bus) {
                        console.log(`${bus['expectedArrival']} ${bus['destinationName']}`);
                    });
                });
            });
        });
    });
}
