export interface IPeerConnectingAction {
  type: "peer/CONNECTING";
  id: string;
}

export interface IPeerConnectedAction {
  type: "peer/CONNECTED";
  id: string;
}

export interface IPeerSendMessageAction {
  type: "peer/SEND_MESSAGE";
  message: string;
}

export interface IPeerReceivedMessageAction {
  type: "peer/RECEIVED_MESSAGE";
  message: string;
}

export interface IPeerReceivedHIAction {
  type: "peer/RECEIVED_HI";
  id: string;
}

export interface IPeerReceivedICEAction {
  type: "peer/RECEIVED_ICE";
  id: string;
  candidate: RTCIceCandidate;
}

export interface IPeerSendSDPAction {
  type: "peer/SEND_SDP";
  id: string;
  offer: boolean;
}

export interface IPeerReceivedSDPAction {
  type: "peer/RECEIVED_SDP";
  id: string;
  description: RTCSessionDescription;
}

export function connecting(id: string): IPeerConnectingAction {
  return {
    type: "peer/CONNECTING",
    id: id
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

export function receiveMessage(message: string): IPeerReceivedMessageAction {
  return {
    type: "peer/RECEIVED_MESSAGE",
    message: message
  };
}

export function receivedHi(id: string): IPeerReceivedHIAction {
  return {
    type: "peer/RECEIVED_HI",
    id: id
  };
}

export function receivedIce(
  id: string,
  candidate: RTCIceCandidate
): IPeerReceivedICEAction {
  return {
    type: "peer/RECEIVED_ICE",
    id: id,
    candidate: candidate
  };
}

export function sendSdp(id: string, offer: boolean): IPeerSendSDPAction {
  return {
    type: "peer/SEND_SDP",
    id: id,
    offer: offer
  };
}

export function receivedSdp(
  id: string,
  description: RTCSessionDescription
): IPeerReceivedSDPAction {
  return {
    type: "peer/RECEIVED_SDP",
    id: id,
    description: description
  };
}

export type IActions =
  | IPeerConnectingAction
  | IPeerConnectedAction
  | IPeerSendMessageAction
  | IPeerSendSDPAction
  | IPeerReceivedMessageAction
  | IPeerReceivedHIAction
  | IPeerReceivedSDPAction
  | IPeerReceivedICEAction;
