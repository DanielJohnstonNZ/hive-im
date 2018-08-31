import { Observable, Observer } from "rxjs";
import { Epic, combineEpics } from "redux-observable";

import { PeerState, receiveMessage, connected } from ".";
import { IActions } from "..";

import {
  ISocketMessageAction,
  socketSend,
  socketSendIce,
  socketSendSdp
} from "../websocket";
import { MetaDataType, MetaData } from "../../../common/metadata";

import { metaSent, IPeerSendMessageAction } from "./actions";

import { store } from "../../";

const peers: { [key: string]: RTCPeerConnection } = {};
const sendChannels: { [key: string]: any } = {};

const onSocketMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .filter((action: ISocketMessageAction) => !peers[action.message.id])
    .mergeMap((action: ISocketMessageAction) => {
      const id = action.message.id;
      peers[id] = new RTCPeerConnection(null);

      let observable = Observable.merge(
        // A data channel is opened.
        Observable.fromEvent(peers[id], "datachannel").mergeMap(
          (event: RTCDataChannelEvent) => {
            return Observable.merge(
              // A peer message is received
              Observable.fromEvent(event.channel, "message").map(
                (event: any) => {
                  return receiveMessage(event.data);
                }
              ),
              // A peer data channel is opened
              Observable.fromEvent(event.channel, "open").map((event: any) => {
                return connected(id);
              })
            );
          }
        ),
        // A local ICE candidate is generated
        Observable.fromEvent(peers[id], "icecandidate")
          .filter(
            (event: RTCPeerConnectionIceEvent) => event.candidate !== null
          )
          .map((event: RTCPeerConnectionIceEvent) => {
            return socketSendIce(id, event.candidate);
          })
      );

      sendChannels[id] = peers[id].createDataChannel("sendDataChannel", null);

      return observable;
    });

// New Peer connection
const onSocketHiMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .filter(
      (action: ISocketMessageAction) => action.message.type === MetaDataType.HI
    )
    .mergeMap((action: ISocketMessageAction) =>
      Observable.fromPromise(peers[action.message.id].createOffer()).mergeMap(
        (value: RTCSessionDescriptionInit) => {
          return Observable.fromPromise(
            peers[action.message.id].setLocalDescription(value)
          ).map(() => {
            return socketSendSdp(
              action.message.id,
              peers[action.message.id].localDescription
            );
          });
        }
      )
    );

// A remote SDP is received
const onSocketSdpMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .filter(
      (action: ISocketMessageAction) => action.message.type === MetaDataType.SDP
    )
    .mergeMap((action: ISocketMessageAction) => {
      return Observable.fromPromise(
        peers[action.message.id].setRemoteDescription(
          new RTCSessionDescription(action.message.payload)
        )
      )
        .filter(() => action.message.payload.type == "offer")
        .flatMap(() => {
          return Observable.fromPromise(
            peers[action.message.id].createAnswer()
          );
        })
        .flatMap((value: RTCSessionDescriptionInit) => {
          return Observable.fromPromise(
            peers[action.message.id].setLocalDescription(value)
          );
        })
        .map(() => {
          return socketSendSdp(
            action.message.id,
            peers[action.message.id].localDescription
          );
        });
    });

// A remote ICE is received.
const onSocketIceMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("websocket/SOCKET_MESSAGE")
    .filter(
      (action: ISocketMessageAction) => action.message.type === MetaDataType.ICE
    )
    .do((action: ISocketMessageAction) => {
      peers[action.message.id].addIceCandidate(
        new RTCIceCandidate(action.message.payload)
      );
    })
    .mapTo(metaSent());

// A remote ICE is received.
const onPeerSendMessage: Epic<IActions, PeerState> = action$ =>
  action$
    .ofType("peer/SEND_MESSAGE")
    .do((action: ISocketMessageAction) => {
      for (let peerId in sendChannels) {
        if (sendChannels[peerId].readyState == "open") {
          sendChannels[peerId].send(action.message);
        }
      }
    })
    .mapTo(metaSent());

export const peerEpics = combineEpics(
  onSocketMessage,
  onSocketHiMessage,
  onSocketSdpMessage,
  onSocketIceMessage,
  onPeerSendMessage
);
