import { PeerMessage, ServerMessageType } from "../models";
import { serverSendMessage, peerReceiveMessage } from "../actions"
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
            .then(() => this.dispatch(serverSendMessage(
                this.uuid, 
                this.rtcConnection.localDescription, 
                ServerMessageType.SDP))
            );
    }

    private handleOnIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate != null) {
            this.dispatch(serverSendMessage(this.uuid, event.candidate, ServerMessageType.ICE));
        }
    }

    private handleOnDataChannel(event: RTCDataChannelEvent) {
        this.rtcReceiveChannel = event.channel;

        this.rtcReceiveChannel.onmessage = (event) => { this.handleReceiveChannelOnMessage(event) };
        this.rtcReceiveChannel.onopen = () => { this.handleReceiveChannelOnOpen() };
        this.rtcReceiveChannel.onclose = () => { this.handleReceiveChannelOnClose() };
    }

    private handleReceiveChannelOnMessage(event: MessageEvent) {
        let newMessage = new PeerMessage();

        newMessage.source = this.uuid;
        newMessage.body = event.data;

        this.dispatch(peerReceiveMessage(newMessage));
    }

    private handleReceiveChannelOnOpen() {
        var readyState = this.rtcReceiveChannel.readyState;
    }

    private handleReceiveChannelOnClose() {
        var readyState = this.rtcSendChannel.readyState;
    }

    public messagePeer(message: PeerMessage) {
        if (this.rtcSendChannel.readyState == 'open') {
            this.rtcSendChannel.send(message.body);
        }
    }
}