const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

var uuid = require('uuid/v4')

var httpLogger = require('debug')('http')
var webSocketLogger = require('debug')('websocket')

const PORT = process.env.PORT || 8080;
const INDEX = path.join(__dirname, '/dist/index.html');

const server = express()
    .use(function (req, res, next) {
        httpLogger(req.url);
        next();
    })
  .use(express.static('dist'))
  .listen(PORT, () => httpLogger(`Listening on ${ PORT }`));

let clients = {};

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
    var clientUuid = uuid();
    webSocketLogger('Connection Opened: ' + clientUuid);
    
    for (var existing in clients) {
        webSocketLogger("Notifying " + existing);
        clients[existing].send(JSON.stringify({source: clientUuid, type: 0}));
    }

    // Add the new client to the directory.
    clients[clientUuid] = ws;

    ws.on('message', function(message) {
        var messageObj;

        try
        {
            messageObj = JSON.parse(message);
        }
        catch (e)
        {
            webSocketLogger("Invalid message received: " + message);
            return;
        }

        webSocketLogger(messageObj);

        webSocketLogger("Message received for " + messageObj.destination);
        messageObj.source = clientUuid;

        if (messageObj.destination && clients[messageObj.destination]) {
            clients[messageObj.destination].send(JSON.stringify(messageObj));
            webSocketLogger("Message passed to " + messageObj.destination)
        } else {
            webSocketLogger("Client not found");
        }
    });

    ws.on('close', function() {
        if (clientUuid && clients[clientUuid]) {
            webSocketLogger('Connection Closed to ' + clientUuid);
            delete clients[clientUuid];
        } else {
            webSocketLogger('Connection Closed to unknown');
        }
    });
});