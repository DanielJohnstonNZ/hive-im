var WebSocketServer = require('ws').Server;
var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

var httpLogger = require('debug')('http')
var webSocketLogger = require('debug')('websocket')

const websocketPort = 3434;
const webPort = 8080;

let clients = {};

var wss = new WebSocketServer({port: websocketPort});

wss.on('connection', function(ws) {
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



// Serve up content folder
var serve = serveStatic('dist', {'index': ['index.html', 'index.htm']})
 
// Create server
var server = http.createServer(function onRequest (req, res) {
    httpLogger(req.method + ' ' + req.url);

    serve(req, res, finalhandler(req, res))
})
 
// Listen
server.listen(webPort, function() {
    httpLogger('Web listening on port ' + webPort);
})