const express = require('express');
const app = express();
const busTimeRequest = require('./api-requests');

// Setup static pages for '/' and '/history'
app.use(express.static('frontend'));
app.use('/history', express.static('frontend/history.html'));

// Internal request for bus data
app.get('/departureBoards', (req, res) => {
    const postcode = req.query.postcode;
    console.log(`Request made for postcode '${postcode}'`);
    
    if (postcode) {
        busTimeRequest.getBusArrivalJSON(postcode).then(
            (json) => {
            res.send(json);
        }, (err) => {
            res.status(400);
            res.send(err);
        });
    } else {
        res.status(400);
        res.send('Did not send postcode in query');
    }
});

app.listen(3000, () => console.log('BusBoard app listening on port 3000'));