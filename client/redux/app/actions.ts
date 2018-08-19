import { Message, MessageType, Peer } from ".";

export interface ISendMessageAction {
  type: "SEND_MESSAGE";
  message: Message;
}

export interface IReceiveMessageAction {
  type: "RECEIVE_MESSAGE";
  message: Message;
}

export interface IPeerConnectedAction {
  type: "PEER_CONNECTED";
  peer: Peer;
}

export interface IPeerDisconnectedAction {
  type: "PEER_DISCONNECTED";
  peer: Peer;
}

export interface IPeerUpdatedAction {
  type: "PEER_UPDATED";
  peer: Peer;
}

export interface IInfoUpdatedAction {
  type: "INFO_UPDATED";
  peer: Peer;
}

export interface IAppLoadAction {
  type: "APP_LOAD";
}

export function sendTextMessage(body: string): ISendMessageAction {
  let message: Message = new Message();
  message.body = body;
  message.type = MessageType.TEXT;

  return {
    type: "SEND_MESSAGE",
    message: message
  };
}

export function receiveTextMessage(message: Message): IReceiveMessageAction {
  return {
    type: "RECEIVE_MESSAGE",
    message: message
  };
}

export function peerConnected(peer: Peer): IPeerConnectedAction {
  return {
    type: "PEER_CONNECTED",
    peer: peer
  };
}

export function peerDisconnected(id: string): IPeerDisconnectedAction {
  let peer: Peer = new Peer();

  peer.id = id;

  return {
    type: "PEER_DISCONNECTED",
    peer: peer
  };
}

export function peerUpdated(peer: Peer): IPeerUpdatedAction {
  return {
    type: "PEER_UPDATED",
    peer
  };
}

export function infoUpdated(peer: Peer): IInfoUpdatedAction {
  return {
    type: "INFO_UPDATED",
    peer: peer
  };
}

export function appLoad(): IAppLoadAction {
  return {
    type: "APP_LOAD"
  };
}

export type IActions =
  | ISendMessageAction
  | IReceiveMessageAction
  | IPeerConnectedAction
  | IPeerDisconnectedAction
  | IPeerUpdatedAction
  | IInfoUpdatedAction
  | IAppLoadAction;
