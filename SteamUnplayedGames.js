var express = require('express');
var request = require('request');
var fs = require('fs');
var formidable = require("formidable");
var app = express();
var steamAPIKey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
app.get('/', function(req, res) {
    displayForm(res);
});

app.post('/', function(req, res) {
    processSteamID(req, res);
});



function displayForm(res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processSteamID(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('Unplayed games for Steam ID ' + fields.steamID + " are:\n");
        var url = 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + steamAPIKey +'&format=json&include_appinfo=1&steamid=' + fields.steamID;
        request.get(url, function(error, steamResponse, steamBody){
            var obj = JSON.parse(steamBody);
            for(i in obj.response.games){
                if(obj.response.games[i].playtime_forever == 0)
                    res.write(obj.response.games[i].name + "\n");
            }
            res.end();
        });
    });
}

var port = 4000;
var server = app.listen(port);
console.log('Listening on port ' + port);