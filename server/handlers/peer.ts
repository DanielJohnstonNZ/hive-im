import { Server } from 'ws';
import * as http from 'http';
import * as uuid from 'uuid/v4';
import * as debug from "debug";

import {Message, MessageType} from "../../common/message"
import {Peer} from "../../common/peer"

export class PeerHandler {
    private socket: Server;
    private clients: any;
    private logger: debug.IDebugger;

    constructor(connection: http.Server) {
        this.clients = {};
        this.logger = debug('websocket');

        this.socket = new Server({ server: connection });
        this.socket.on('connection', (socket: any) => this.handleNewPeer(socket));
    }

    private handleNewPeer(socket: any) {
        let clientInfo: Peer = {
            id: uuid(),
            displayName: "User" + Math.round(Math.random() * 100)
        };
    
        this.logger('Connection Opened: ' + clientInfo.id);
    
        let hiMessage: Message = new Message();
        hiMessage.type = MessageType.HI;
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
    
        socket.on('message', (message: any) => this.handlePeerMessage(message, clientInfo));
        socket.on('close', () => this.handlePeerDisconnection(clientInfo));
    }

    private handlePeerMessage(message: string, clientInfo: any) {
        var messageObj: Message;
        
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
            this.logger("Message passed to " + messageObj.destination)
        } else {
            this.logger("Client not found");
        }
    }

    private handlePeerDisconnection(clientInfo: Peer) {
        if (this.clients[clientInfo.id]) {
            this.logger('Connection Closed to ' + clientInfo.id);
            delete this.clients[clientInfo.id];
        } else {
            this.logger('Connection Closed to unknown');
        }

        let byeMessage: Message = new Message();
        byeMessage.type = MessageType.BYE;
        byeMessage.source = clientInfo;

        // Notify other clients of the disconnection.
        this.broadcast(byeMessage);
    }

    private broadcast(message: Message) {
        for (var existing in this.clients) {
            this.logger("Notifying " + existing);
            this.clients[existing].send(JSON.stringify(message));
        }
    }
}