const express = require('express');
const app = express();
const busTimeRequest = require('./api-requests');

app.get('/departureBoards', (req, res) => {
    let postcode = req.query.postcode;
    if (postcode) {
        busTimeRequest.getBusArrivalJSON(postcode).then((json) => {
            res.send(json);
        }).catch((err) => console.log(err));
    } else {
        res.send('Did not send postcode in query');
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));