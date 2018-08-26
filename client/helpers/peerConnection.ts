import { WebRTCSupport } from "./webRtcSupport";

import * as peerActions from "../redux/peer";
import * as websocketActions from "../redux/websocket";
import { store } from "../";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

export class PeerConnection {
  private id: string;

  private rtcConnection: RTCPeerConnection;
  private rtcReceiveChannel: RTCDataChannel;
  private rtcSendChannel: RTCDataChannel;

  public onLocalDescription: (candidate: RTCSessionDescription) => void;

  constructor(id: string) {
    if (!WebRTCSupport) {
      // The browser doesn't support webrtc.
      return;
    }

    this.id = id;

    this.rtcConnection = new RTCPeerConnection(peerConnectionConfig);
    this.rtcConnection.ondatachannel = event => {
      this.handleOnDataChannel(event);
    };

    this.rtcConnection.onicecandidate = event => {
      this.handleOnIceCandidate(event);
    };

    this.rtcSendChannel = this.rtcConnection.createDataChannel(
      "sendDataChannel",
      null
    );
  }

  public createOffer() {
    this.rtcConnection
      .createOffer()
      .then(description => this.setLocalDescription(description));
  }

  public addIceCandidate(body: any) {
    this.rtcConnection.addIceCandidate(new RTCIceCandidate(body));
  }

  public addRemoteDescription(body: any) {
    let peer = this;

    this.rtcConnection
      .setRemoteDescription(new RTCSessionDescription(body))
      .then(function() {
        // Only create answers in response to offers
        if (body.type == "offer") {
          peer.rtcConnection.createAnswer().then(function(description) {
            peer.setLocalDescription(description);
          });
        }
      });
  }

  private setLocalDescription(details: RTCSessionDescriptionInit) {
    this.rtcConnection.setLocalDescription(details).then(() => {
      store.dispatch(
        websocketActions.socketSendSdp(
          this.id,
          this.rtcConnection.localDescription
        )
      );
    });
  }

  private handleOnIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate != null) {
      store.dispatch(websocketActions.socketSendIce(this.id, event.candidate));
    }
  }

  private handleOnDataChannel(event: RTCDataChannelEvent) {
    this.rtcReceiveChannel = event.channel;

    this.rtcReceiveChannel.onmessage = event => {
      store.dispatch(peerActions.receiveMessage(event.data));
    };

    this.rtcReceiveChannel.onopen = () => {
      store.dispatch(peerActions.connected(this.id));
    };
  }

  public messagePeer(message: string) {
    if (this.rtcSendChannel.readyState == "open") {
      this.rtcSendChannel.send(message);
    }
  }
}
