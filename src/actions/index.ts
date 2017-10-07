import {ServerMessage, ServerMessageType, PeerMessage, Peer} from "../models"

export enum ActionTypes {
    SERVER_SEND_MESSAGE,
    SERVER_RECEIVE_MESSAGE,
    PEER_RECEIVE_MESSAGE,
    PEER_SEND_MESSAGE,
    PEER_CONNECTED,
    PEER_DISCONNECTED
}

export function serverSendMessage(destination: string, body: any, type: ServerMessageType) {
    let message: ServerMessage = new ServerMessage;
    message.body = body;
    message.destination = destination
    message.type = type;

    return {
        type: ActionTypes.SERVER_SEND_MESSAGE,
        message: JSON.stringify(message)
    }
}

export function serverReceiveMessage(message: string) {
    let parsedMessage : ServerMessage = JSON.parse(message);

    return {
        type: ActionTypes.SERVER_RECEIVE_MESSAGE,
        message: parsedMessage
    }
}

export function peerReceiveMessage(uuid: string, body: string) {
    let newMessage = new PeerMessage();
    
    newMessage.source = uuid;
    newMessage.body = body;

    return {
        type: ActionTypes.PEER_RECEIVE_MESSAGE,
        newMessage
    }
}

export function peerSendMessage(message: string) {
    let peerMessage: PeerMessage = new PeerMessage;
    peerMessage.body = message;

    return {
        type: ActionTypes.PEER_SEND_MESSAGE,
        message: peerMessage
    }
}

export function peerConnected(id: string) {
    let newPeer = new Peer;
    
    newPeer.id = id;

    return {
        type: ActionTypes.PEER_CONNECTED,
        peer: newPeer
    }
}

export function peerDisconnected(id: string) {
    let peer = new Peer;
    
    peer.id = id;

    return {
        type: ActionTypes.PEER_DISCONNECTED,
        peer: peer
    }
}
