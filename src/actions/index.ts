import {Message, MessageType, Peer} from "../models"

export enum ActionTypeKeys {
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    PEER_CONNECTED,
    PEER_DISCONNECTED,
    PEER_UPDATED,
    INFO_UPDATED
}

export interface ISendMessageAction{
    type: ActionTypeKeys.SEND_MESSAGE,
    message: Message
}

export interface IReceiveMessageAction{
    type: ActionTypeKeys.RECEIVE_MESSAGE,
    message: Message
}

export interface IPeerConnectedAction{
    type: ActionTypeKeys.PEER_CONNECTED,
    peer: Peer
}

export interface IPeerDisconnectedAction {
    type: ActionTypeKeys.PEER_DISCONNECTED,
    peer: Peer
}

export interface IPeerUpdatedAction {
    type: ActionTypeKeys.PEER_UPDATED,
    peer: Peer
}

export interface IInfoUpdatedAction {
    type: ActionTypeKeys.INFO_UPDATED,
    peer: Peer
}

export function sendTextMessage(body: string) : ISendMessageAction {
    let message: Message = new Message;
    message.body = body;
    message.type = MessageType.TEXT;

    return {
        type: ActionTypeKeys.SEND_MESSAGE,
        message: message
    }
}

export function receiveTextMessage(message: Message) : IReceiveMessageAction {
    return {
        type: ActionTypeKeys.RECEIVE_MESSAGE,
        message: message
    }
}

export function peerConnected(peer: Peer) : IPeerConnectedAction {
    return {
        type: ActionTypeKeys.PEER_CONNECTED,
        peer: peer
    }
}


export function peerDisconnected(id: string) : IPeerDisconnectedAction {
    let peer = new Peer;
    
    peer.id = id;

    return {
        type: ActionTypeKeys.PEER_DISCONNECTED,
        peer: peer
    }
}

export function peerUpdated(peer: Peer) : IPeerUpdatedAction {
    return {
        type: ActionTypeKeys.PEER_UPDATED,
        peer
    }
}

export function infoUpdated(peer: Peer) : IInfoUpdatedAction {
    return {
        type: ActionTypeKeys.INFO_UPDATED,
        peer: peer
    }
}

export type IActions = ISendMessageAction | IReceiveMessageAction
    | IPeerConnectedAction | IPeerDisconnectedAction | IPeerUpdatedAction | IInfoUpdatedAction
