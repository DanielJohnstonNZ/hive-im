import { WebRTCSupport } from "./webRtcSupport";
import { Message } from "../redux";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

export class PeerConnection {
  private rtcConnection: RTCPeerConnection;
  private rtcReceiveChannel: RTCDataChannel;
  private rtcSendChannel: RTCDataChannel;

  public onIceCandidate: (candidate: RTCIceCandidate) => void;
  public onLocalDescription: (candidate: RTCSessionDescription) => void;
  public onConnected: () => void;
  public onDataMessage: (message: Message) => void;

  constructor() {
    if (!WebRTCSupport) {
      // The browser doesn't support webrtc.
      return;
    }

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
    this.rtcConnection
      .setLocalDescription(details)
      .then(() => this.onLocalDescription(this.rtcConnection.localDescription));
  }

  private handleOnIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate != null) {
      this.onIceCandidate(event.candidate);
    }
  }

  private handleOnDataChannel(event: RTCDataChannelEvent) {
    this.rtcReceiveChannel = event.channel;

    this.rtcReceiveChannel.onmessage = event => {
      this.handleReceiveChannelOnMessage(event);
    };
    this.rtcReceiveChannel.onopen = () => {
      this.handleReceiveChannelOnOpen();
    };
  }

  private handleReceiveChannelOnMessage(event: MessageEvent) {
    this.onDataMessage(JSON.parse(event.data));
  }

  private handleReceiveChannelOnOpen() {
    this.onConnected();
  }

  public messagePeer(message: Message) {
    if (this.rtcSendChannel.readyState == "open") {
      this.rtcSendChannel.send(JSON.stringify(message));
    }
  }
}
