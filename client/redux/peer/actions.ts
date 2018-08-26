export interface IPeerMetaSentAction {
  type: "peer/META_SENT";
}

export interface IPeerConnectedAction {
  type: "peer/CONNECTED";
  id: string;
}

export interface IPeerSendMessageAction {
  type: "peer/SEND_MESSAGE";
  message: string;
}

export interface IPeerReceiveMessageAction {
  type: "peer/RECEIVE_MESSAGE";
  message: string;
}

export function metaSent(): IPeerMetaSentAction {
  return {
    type: "peer/META_SENT"
  };
}

export function connected(id: string): IPeerConnectedAction {
  return {
    type: "peer/CONNECTED",
    id: id
  };
}

export function sendMessage(message: string): IPeerSendMessageAction {
  return {
    type: "peer/SEND_MESSAGE",
    message: message
  };
}

export function receiveMessage(message: string): IPeerReceiveMessageAction {
  return {
    type: "peer/RECEIVE_MESSAGE",
    message: message
  };
}

export type IActions =
  | IPeerMetaSentAction
  | IPeerConnectedAction
  | IPeerSendMessageAction
  | IPeerReceiveMessageAction;
