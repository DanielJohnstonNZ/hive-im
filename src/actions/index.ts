import {ServerMessage, ServerMessageType} from "../models/serverMessage"
import {PeerMessage} from "../models/peerMessage"

export enum ActionTypes {
    SERVER_SEND_MESSAGE,
    SERVER_RECEIVE_MESSAGE,
    PEER_RECEIVE_MESSAGE,
    PEER_SEND_MESSAGE
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

export function peerReceiveMessage(message: PeerMessage) {
    return {
        type: ActionTypes.PEER_RECEIVE_MESSAGE,
        message
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