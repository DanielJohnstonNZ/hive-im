const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

var httpLogger = require('debug')('http')
var webSocketLogger = require('debug')('websocket')

const PORT = process.env.PORT || 8080;
const INDEX = path.join(__dirname, '/dist/index.html');

const server = express()
  .use(express.static('dist'))
  .listen(PORT, () => httpLogger(`Listening on ${ PORT }`));

let clients = {};

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
    webSocketLogger('Connection Opened');
    
    var clientUuid;

    ws.on('message', function(message) {
        var messageObj = JSON.parse(message);
        webSocketLogger(messageObj);

        switch(messageObj.type) {
            case 0:
                clientUuid = messageObj.source;

                webSocketLogger("Hi received.")
                for (var existing in clients) {
                    webSocketLogger("Notifying " + existing);
                    clients[existing].send(message);
                }
    
                // Add the new client to the directory.
                clients[messageObj.source] = ws;
            break;
            case 1:
            case 2:
                webSocketLogger("Message received for " + messageObj.destination);

                if (messageObj.destination && clients[messageObj.destination]) {
                    clients[messageObj.destination].send(message);
                    webSocketLogger("Message passed to " + messageObj.destination)
                } else {
                    webSocketLogger("Client not found");
                }
            break;
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