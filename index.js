const express = require('express');
const app = express();
const busTimeRequest = require('./api-requests');

app.use(express.static('frontend'));
app.use('/history', express.static('frontend/history.html'));
app.get('/departureBoards', (req, res) => {
    let postcode = req.query.postcode;
    if (postcode) {
        busTimeRequest.getBusArrivalJSON(postcode).then((json) => {
            res.send(json);
        }).catch((err) => {
            res.status(400);
            res.send('Invalid postcode');
        });
    } else {
        res.status(400);
        res.send('Did not send postcode in query');
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));