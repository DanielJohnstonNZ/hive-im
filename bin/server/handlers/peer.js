"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const uuid = require("uuid/v4");
const debug = require("debug");
const message_1 = require("../../common/message");
class PeerHandler {
    constructor(connection) {
        this.clients = {};
        this.logger = debug('websocket');
        this.socket = new ws_1.Server({ server: connection });
        this.socket.on('connection', (socket) => this.handleNewPeer(socket));
    }
    handleNewPeer(socket) {
        let clientInfo = {
            id: uuid(),
            displayName: "User" + Math.round(Math.random() * 100)
        };
        this.logger('Connection Opened: ' + clientInfo.id);
        let hiMessage = new message_1.Message();
        hiMessage.type = message_1.MessageType.HI;
        hiMessage.source = clientInfo;
        hiMessage.body = clientInfo;
        this.broadcast(hiMessage);
        // Send the info packet to the client.
        socket.send(JSON.stringify({
            type: 5,
            body: clientInfo
        }));
        // Add the new client to the directory.
        this.clients[clientInfo.id] = socket;
        socket.on('message', (message) => this.handlePeerMessage(message, clientInfo));
        socket.on('close', () => this.handlePeerDisconnection(clientInfo));
    }
    handlePeerMessage(message, clientInfo) {
        var messageObj;
        try {
            messageObj = JSON.parse(message);
        }
        catch (e) {
            this.logger("Invalid message received: " + message);
            return;
        }
        this.logger(messageObj);
        this.logger("Message received for " + messageObj.destination);
        messageObj.source = clientInfo;
        if (messageObj.destination && this.clients[messageObj.destination]) {
            this.clients[messageObj.destination].send(JSON.stringify(messageObj));
            this.logger("Message passed to " + messageObj.destination);
        }
        else {
            this.logger("Client not found");
        }
    }
    handlePeerDisconnection(clientInfo) {
        if (this.clients[clientInfo.id]) {
            this.logger('Connection Closed to ' + clientInfo.id);
            delete this.clients[clientInfo.id];
        }
        else {
            this.logger('Connection Closed to unknown');
        }
        let byeMessage = new message_1.Message();
        byeMessage.type = message_1.MessageType.BYE;
        byeMessage.source = clientInfo;
        // Notify other clients of the disconnection.
        this.broadcast(byeMessage);
    }
    broadcast(message) {
        for (var existing in this.clients) {
            this.logger("Notifying " + existing);
            this.clients[existing].send(JSON.stringify(message));
        }
    }
}
exports.PeerHandler = PeerHandler;
