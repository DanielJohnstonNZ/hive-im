import { PeerConnection } from "./peerConnection";
import { Message, MessageType, Peer } from "../redux";

import { MetaDataType, MetaData } from "../../common/metadata";

import { socketSend, socketSent } from "../redux/websocket";
import { store } from "../";

export class PeerFactory {
  private activePeers: { [id: string]: PeerConnection };

  public onMessage: (message: Message) => void;
  public onConnection: (id: string) => void;

  constructor() {
    this.activePeers = {};
  }

  public getConnection(peerId: string) {
    if (!this.activePeers[peerId]) {
      let pc: PeerConnection = new PeerConnection();

      pc.onIceCandidate = (candidate: RTCIceCandidate) => {
        let data: MetaData = new MetaData(peerId, MetaDataType.ICE, candidate);

        store.dispatch(socketSend(data));
      };

      pc.onLocalDescription = (description: RTCSessionDescription) => {
        let data: MetaData = new MetaData(
          peerId,
          MetaDataType.SDP,
          description
        );

        store.dispatch(socketSend(data));
      };

      pc.onConnected = () => {
        this.onConnection(peerId);
      };

      pc.onDataMessage = (message: Message) => {
        //message.source = peer;

        this.onMessage(message);
      };

      this.activePeers[peerId] = pc;
    }

    return this.activePeers[peerId];
  }

  public metaDataInput(data: MetaData) {
    switch (data.type) {
      case MetaDataType.HI:
        this.getConnection(data.id).createOffer();

        break;
      case MetaDataType.SDP:
        this.getConnection(data.id).addRemoteDescription(data.payload);
        break;
      case MetaDataType.ICE:
        this.getConnection(data.id).addIceCandidate(data.payload);
        break;
    }
  }

  public messagePeer(message: Message) {
    switch (message.type) {
      case MessageType.BYE:
        console.log(message);
      //dispatch(Actions.peerDisconnected(message.source.id));
      //break;
      case MessageType.INFO:
        console.log(message);
      //dispatch(Actions.infoUpdated(message.body));
      //break;
    }
  }

  public messageAll(message: Message) {
    for (var i in this.activePeers) {
      this.activePeers[i].messagePeer(message);
    }
  }

  private handleOnClose(id: string) {
    delete this.activePeers[id];
  }
}
