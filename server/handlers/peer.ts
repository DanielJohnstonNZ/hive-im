import { Server } from 'ws';
import * as http from 'http';
import * as uuid from 'uuid/v4';
import * as debug from "debug";

import {MetaData,MetaDataType} from "../../common/metadata"

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
        let clientId = uuid();
    
        this.logger('Connection Opened: ' + clientId);
    
        this.broadcast(new MetaData(clientId, MetaDataType.HI, null));
    
        // Add the new client to the directory.
        this.clients[clientId] = socket;
    
        socket.on('message', (message: any) => this.handlePeerMessage(message, clientId));
        socket.on('close', () => this.handlePeerDisconnection(clientId));
    }

    private handlePeerMessage(message: string, clientId: string) {
        var messageObj: MetaData;
        
        try {
            messageObj = JSON.parse(message);
        }
        catch (e) {
            this.logger("Invalid message received: " + message);
            return;
        }

        this.logger(messageObj);
        this.logger("Message received for " + messageObj.id);

        if (messageObj.id && this.clients[messageObj.id]) {
            let destinationId = messageObj.id;

            // Update the Id to the source.
            messageObj.id = clientId;

            this.clients[destinationId].send(JSON.stringify(messageObj));
            this.logger("Message passed to " + destinationId)
        } else {
            this.logger("Client not found");
        }
    }

    private handlePeerDisconnection(clientId: string) {
        if (this.clients[clientId]) {
            this.logger('Connection Closed to ' + clientId);
            delete this.clients[clientId];
        } else {
            this.logger('Connection Closed to unknown');
        }
    }

    private broadcast(message: MetaData) {
        for (var existing in this.clients) {
            this.logger("Notifying " + existing);
            this.clients[existing].send(JSON.stringify(message));
        }
    }
}