import { ServerMessageType } from "../models";
import * as Actions from "../actions"
import { WebRTCSupport } from "../helpers/webRtcSupport"

const peerConnectionConfig = {
    'iceServers': [
        { 'urls': 'stun:stun.services.mozilla.com' },
        { 'urls': 'stun:stun.l.google.com:19302' },
    ]
};

export class PeerConnection {
    public rtcConnection: RTCPeerConnection;
    public rtcReceiveChannel: RTCDataChannel;
    public rtcSendChannel: RTCDataChannel;

    public uuid: string;

    private dispatch: any;

    constructor(uuid: string, dispatch: any) {
        if (!WebRTCSupport) {
            // The browser doesn't support webrtc.
            return;
        }

        this.uuid = uuid;

        this.dispatch = dispatch;

        this.rtcConnection = new RTCPeerConnection(peerConnectionConfig);
        this.rtcConnection.ondatachannel = (event) => { this.handleOnDataChannel(event) }
        this.rtcConnection.onicecandidate = (event) => { this.handleOnIceCandidate(event) }

        this.rtcSendChannel = this.rtcConnection.createDataChannel('sendDataChannel', null);
    }

    public createOffer() {
        this.rtcConnection
            .createOffer()
            .then((description) => this.setLocalDescription(description));
    }

    public addIceCandidate(body: any) {
        this.rtcConnection
            .addIceCandidate(new RTCIceCandidate(body));
    }

    public addRemoteDescription(body: any) {
        let peer = this;

        this.rtcConnection
            .setRemoteDescription(new RTCSessionDescription(body))
            .then(function () {
                // Only create answers in response to offers
                if (body.type == 'offer') {
                    peer.rtcConnection
                        .createAnswer()
                        .then(function (description) {
                            peer.setLocalDescription(description);
                        });
                }
            });
    }

    private setLocalDescription(details: RTCSessionDescriptionInit) {
        this.rtcConnection
            .setLocalDescription(details)
            .then(() => this.dispatch(Actions.serverSendMessage(
                this.uuid, 
                this.rtcConnection.localDescription, 
                ServerMessageType.SDP))
            );
    }

    private handleOnIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate != null) {
            this.dispatch(Actions.serverSendMessage(this.uuid, event.candidate, ServerMessageType.ICE));
        }
    }

    private handleOnDataChannel(event: RTCDataChannelEvent) {
        this.rtcReceiveChannel = event.channel;

        this.rtcReceiveChannel.onmessage = (event) => { this.handleReceiveChannelOnMessage(event) };
        this.rtcReceiveChannel.onopen = () => { this.handleReceiveChannelOnOpen() };
        this.rtcReceiveChannel.onclose = () => { this.handleReceiveChannelOnClose() };
    }

    private handleReceiveChannelOnMessage(event: MessageEvent) {
        this.dispatch(Actions.peerReceiveMessage(this.uuid, event.data));
    }

    private handleReceiveChannelOnOpen() {
        this.dispatch(Actions.peerConnected(this.uuid));
    }

    private handleReceiveChannelOnClose() {
        console.log("closed");
    }

    public messagePeer(message: string) {
        if (this.rtcSendChannel.readyState == 'open') {
            this.rtcSendChannel.send(message);
        }
    }
}