import * as express from 'express'
import {Server}  from 'ws';
import * as uuid from 'uuid/v4'
import * as debug from "debug";

var httpLogger = require('debug')('http')
var webSocketLogger = require('debug')('websocket')

const PORT = process.env.PORT || 8080;

const server = express()
    .use(function (req: any, res: any, next: any) {
        httpLogger(req.url);
        next();
    })
  .use(express.static('webroot'))
  .listen(PORT, () => httpLogger(`Listening on ${ PORT }`));

let clients: any = {};

const wss = new Server({ server });

wss.on('connection', (ws: any) => {
    var clientInfo = {
        id: uuid(),
        displayName: "User" + Math.round(Math.random() * 100)
    };

    webSocketLogger('Connection Opened: ' + clientInfo.id);
    
    for (var existing in clients) {
        webSocketLogger("Notifying " + existing);
        clients[existing].send(JSON.stringify({
            source: clientInfo, 
            type: 0,
            body: clientInfo
        }));
    }

    // Send the info packet to the client.
    ws.send(JSON.stringify({
        type: 5,
        body: clientInfo
    }));

    // Add the new client to the directory.
    clients[clientInfo.id] = ws;

    ws.on('message', function(message: any) {
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
        messageObj.source = clientInfo;

        if (messageObj.destination && clients[messageObj.destination]) {
            clients[messageObj.destination].send(JSON.stringify(messageObj));
            webSocketLogger("Message passed to " + messageObj.destination)
        } else {
            webSocketLogger("Client not found");
        }
    });

    ws.on('close', function() {
        if (clients[clientInfo.id]) {
            webSocketLogger('Connection Closed to ' + clientInfo.id);
            delete clients[clientInfo.id];
        } else {
            webSocketLogger('Connection Closed to unknown');
        }

        // Notify other clients of the disconnection.
        for (var existing in clients) {
            webSocketLogger("Notifying " + existing);
            clients[existing].send(JSON.stringify({source: clientInfo.id, type: 3}));
        }
    });
});