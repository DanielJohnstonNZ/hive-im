import { PeerConnection } from "./peerConnection";
import { MetaDataType, MetaData } from "../../common/metadata";
import * as websocketActions from "../redux/websocket";
import { store } from "../";

export class PeerFactory {
  private activePeers: { [id: string]: PeerConnection };

  constructor() {
    this.activePeers = {};
  }

  public getConnection(peerId: string) {
    if (!this.activePeers[peerId]) {
      this.activePeers[peerId] = new PeerConnection(peerId);
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

  public messageAll(message: string) {
    for (var i in this.activePeers) {
      this.activePeers[i].messagePeer(message);
    }
  }

  private handleOnClose(id: string) {
    delete this.activePeers[id];
  }
}
