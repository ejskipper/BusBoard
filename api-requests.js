const request = require('request-promise-native');
const moment = require('moment');

// API Credentials
const appId = '4586bfa0';
const appKey = '4236304488967b5683897c8980725377';            

function getBusArrivalJSON(postcode) {
    
    return request(`https://api.postcodes.io/postcodes/${postcode}`).then(body => {
        // Handle user entering garbage postcode
        let postcodeInfoAsJSON = JSON.parse(body);
        if (postcodeInfoAsJSON['status'] === 404) {
            throw 'Invalid postcode';
        }

        // Extract postcode lat lon
        const latitude = postcodeInfoAsJSON['result']['latitude'];
        const longitude = postcodeInfoAsJSON['result']['longitude'];
        
        const radius = 1000; 
        const busStopURL = `https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanOnstreetBusCoachStopPair&radius=${radius}&lat=${latitude}&lon=${longitude}`;   
        return request(busStopURL);
        })

    .then(body => {
        const stopPointsAsJSON = JSON.parse(body);
        let promises = [];

        // Get first two closests bus stops
        stopPointsAsJSON['stopPoints'].slice(0,2).forEach(function(stop) {
            stop['lineGroup'].forEach(function(directedStop) {
                const stopId = directedStop['naptanIdReference'];
                const requestURL = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_id=${appId}&app_key=${appKey}`;

                // Get bus times from this stop
                promises.push(request(requestURL));
            });
        });
        return Promise.all(promises);
    })

    .then(bodies => {
        let busTimes = bodies.map(body => buildBusTimesJSON(body));
        return Promise.resolve(busTimes);
    })

    .catch((err) => reject(err.message));
}

function buildBusTimesJSON(body) {
    const busTimeAsJSON = JSON.parse(body);

    let buses = [];
    // Get first 5 buses and print their info
    let stopName = busTimeAsJSON[1]['stationName'];
    let direction = busTimeAsJSON[1]['direction'];
    busTimeAsJSON.slice(0,5).forEach(function(bus) {
        const minutesUntil = moment(bus['expectedArrival']).fromNow();
        buses.push({'time': minutesUntil,
                    'destination' : bus['destinationName']});
    });

    return {'stopName' : stopName,
            'direction' : direction,
            'buses' : buses};
}

module.exports = {getBusArrivalJSON}