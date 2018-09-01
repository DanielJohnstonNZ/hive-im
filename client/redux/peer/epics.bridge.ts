import { Observable, Observer } from "rxjs";
import { Epic, combineEpics } from "redux-observable";

import { PeerState, receiveMessage, connected } from ".";
import { IActions } from "..";
import { ISocketMessageAction, socketSendIce } from "../websocket";
import { MetaDataType } from "../../../common/metadata";
import { receivedHi, receivedSdp, receivedIce, connecting } from "./actions";
import { Peers } from "./factory";

// If no Peer exists for this signal, fire off a connecting action.
const onNewPeerSignal: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .filter((action: ISocketMessageAction) => !Peers.exists(action.message.id))
    .map((action: ISocketMessageAction) => connecting(action.message.id));

// Translate the signal to a peer action.
const onSocketMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .map((action: ISocketMessageAction) => {
      switch (action.message.type) {
        case MetaDataType.HI:
          return receivedHi(action.message.id);
        case MetaDataType.SDP:
          return receivedSdp(
            action.message.id,
            new RTCSessionDescription(action.message.payload)
          );
        case MetaDataType.ICE:
          return receivedIce(
            action.message.id,
            new RTCIceCandidate(action.message.payload)
          );
        default:
          throw new Error("Invalid signal message received");
      }
    });

export const bridgeEpics = combineEpics(onNewPeerSignal, onSocketMessage);
