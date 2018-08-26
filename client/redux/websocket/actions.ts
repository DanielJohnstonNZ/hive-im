import { MetaData } from "../../../common/metadata";

export interface ISocketConnectingAction {
  type: "websocket/SOCKET_CONNECTING";
}

export interface ISocketConnectedAction {
  type: "websocket/SOCKET_CONNECTED";
}

export interface ISocketDisconnectedAction {
  type: "websocket/SOCKET_DISCONNECTED";
}

export interface ISocketMessageAction {
  type: "websocket/SOCKET_MESSAGE";
  message: MetaData;
}

export interface ISocketSendAction {
  type: "websocket/SOCKET_SEND";
  message: MetaData;
}

export interface ISocketSendIceAction {
  type: "websocket/SOCKET_SEND_ICE";
  id: string;
  candidate: RTCIceCandidate;
}

export interface ISocketSendSdpAction {
  type: "websocket/SOCKET_SEND_SDP";
  id: string;
  sdp: RTCSessionDescription;
}

export interface ISocketSentAction {
  type: "websocket/SOCKET_SENT";
  message: MetaData;
}

export interface ISocketSelectRoom {
  type: "websocket/SOCKET_SELECT_ROOM";
  room: string;
}

export function socketConnecting(): ISocketConnectingAction {
  return {
    type: "websocket/SOCKET_CONNECTING"
  };
}

export function socketConnected(): ISocketConnectedAction {
  return {
    type: "websocket/SOCKET_CONNECTED"
  };
}

export function socketDisconnected(): ISocketDisconnectedAction {
  return {
    type: "websocket/SOCKET_DISCONNECTED"
  };
}

export function socketMessage(message: MetaData): ISocketMessageAction {
  return {
    type: "websocket/SOCKET_MESSAGE",
    message: message
  };
}

export function socketSend(message: MetaData): ISocketSendAction {
  return {
    type: "websocket/SOCKET_SEND",
    message: message
  };
}

export function socketSendIce(
  id: string,
  candidate: RTCIceCandidate
): ISocketSendIceAction {
  return {
    type: "websocket/SOCKET_SEND_ICE",
    id: id,
    candidate: candidate
  };
}

export function socketSendSdp(
  id: string,
  sdp: RTCSessionDescription
): ISocketSendSdpAction {
  return {
    type: "websocket/SOCKET_SEND_SDP",
    id: id,
    sdp: sdp
  };
}

export function socketSent(message: MetaData): ISocketSentAction {
  return {
    type: "websocket/SOCKET_SENT",
    message: message
  };
}

export function socketSelectRoom(): ISocketSelectRoom {
  return {
    type: "websocket/SOCKET_SELECT_ROOM",
    room: "default" // TODO update after room selector added.
  };
}

export type IActions =
  | ISocketConnectingAction
  | ISocketConnectedAction
  | ISocketDisconnectedAction
  | ISocketMessageAction
  | ISocketSendAction
  | ISocketSentAction
  | ISocketSendIceAction
  | ISocketSendSdpAction
  | ISocketSelectRoom;
