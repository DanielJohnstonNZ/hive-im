import { Observable } from "rxjs";
import { Epic, combineEpics } from "redux-observable";

import { PeerState } from ".";
import { IActions } from "..";

import { Peers } from "./factory";
import { socketSendSdp, socketSendIce } from "../websocket";

import {
  IPeerReceivedHIAction,
  IPeerReceivedSDPAction,
  IPeerReceivedICEAction,
  IPeerSendMessageAction,
  IPeerConnectingAction,
  receiveMessage,
  connected,
  IPeerSendSDPAction
} from "./actions";

import { bridgeEpics } from "./epics.bridge";

// On a new Peer connecting, add an observable for the WebRTC events to the epic
const onPeerConnecting: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("peer/CONNECTING")
    .mergeMap((action: IPeerConnectingAction) => {
      const peer = Peers.connection(action.id);

      return Observable.merge(
        // A data channel is opened.
        Observable.fromEvent(peer, "datachannel").mergeMap(
          (event: RTCDataChannelEvent) => {
            return Observable.merge(
              // A peer message is received
              Observable.fromEvent(event.channel, "message").map(
                (event: any) => {
                  return receiveMessage(event.data);
                }
              ),
              // A peer data channel is opened
              Observable.fromEvent(event.channel, "open").mapTo(
                connected(action.id)
              )
            );
          }
        ),
        // A local ICE candidate is generated
        Observable.fromEvent(peer, "icecandidate")
          .filter(
            (event: RTCPeerConnectionIceEvent) => event.candidate !== null
          )
          .map((event: RTCPeerConnectionIceEvent) => {
            return socketSendIce(action.id, event.candidate);
          })
      );
    });

// On a HI signal, create a new WebRTC offer
const onPeerHiMessage: Epic<IActions, PeerState> = action$ =>
  action$.ofType("peer/RECEIVED_HI").mergeMap((action: IPeerReceivedHIAction) =>
    Observable.fromPromise(Peers.connection(action.id).createOffer()).mergeMap(
      (value: RTCSessionDescriptionInit) => {
        return Observable.fromPromise(
          Peers.connection(action.id).setLocalDescription(value)
        ).map(() => {
          return socketSendSdp(
            action.id,
            Peers.connection(action.id).localDescription
          );
        });
      }
    )
  );

// A remote SDP is received
const onPeerSdpMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("peer/RECEIVED_SDP")
    .mergeMap((action: IPeerReceivedSDPAction) => {
      return Observable.fromPromise(
        Peers.connection(action.id).setRemoteDescription(action.description)
      )
        .filter(() => action.description.type == "offer")
        .flatMap(() => {
          return Observable.fromPromise(
            Peers.connection(action.id).createAnswer()
          );
        })
        .flatMap((value: RTCSessionDescriptionInit) => {
          return Observable.fromPromise(
            Peers.connection(action.id).setLocalDescription(value)
          );
        })
        .map(() => {
          return socketSendSdp(
            action.id,
            Peers.connection(action.id).localDescription
          );
        });
    });

// A remote ICE is received.
const onPeerIceMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("peer/RECEIVED_ICE")
    .do((action: IPeerReceivedICEAction) => {
      Peers.connection(action.id).addIceCandidate(action.candidate);
    })
    .ignoreElements();

// A message is to be sent to all peers
const onPeerSendMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("peer/SEND_MESSAGE")
    .do((action: IPeerSendMessageAction) => {
      Peers.sendChannels().forEach(c => {
        c.send(action.message);
      });
    })
    .ignoreElements();

export const peerEpics = combineEpics(
  bridgeEpics,
  onPeerConnecting,
  onPeerHiMessage,
  onPeerSdpMessage,
  onPeerIceMessage,
  onPeerSendMessage
);
