const express = require("express");
const app = express();
const dialogflow_Q = require('./plan_a_trip')
var bodyParser = require('body-parser')
const cors = require('cors');
// const { response } = require("express");
const fs = require('fs')

app.use(cors());
app.use(bodyParser.json())

app.post("/test", (request, response) => {
    console.log(request.body.queryText);
    dialogflow_Q.callDetectIntent(request.body.queryText, request.body.sessionId).then(res => {
        response.json({
            text: res[0].queryResult.fulfillmentText,
            queryResult: res[0].queryResult,
            outputContexts: res[0].queryResult.outputContexts
        })
    });
    
});

app.post("/getItinerary", (request, response) => {
    if (request.body.amount == 1500) {
        let rawdata = fs.readFileSync(`./1500_USD.json`);
        rawdata = JSON.parse(rawdata);
        response.json(rawdata)
    } else {
        res.json({})
    }
})

var port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
 console.log("Your app is listening on port " + listener.address().port);
});