import { ServerMessage, ServerMessageType } from "./serverMessage";

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

    public eventIceCandidate: (candidate: RTCIceCandidate) => void;
    public eventDescription: (description: RTCSessionDescription) => void;
    public eventOnMessage: (message : any) => void;
    public uuid: string;

    constructor(uuid: string) {
        this.uuid = uuid;
        this.rtcConnection = new RTCPeerConnection(peerConnectionConfig);
        this.rtcConnection.ondatachannel = (event) => { this.handleOnDataChannel(event) }
        this.rtcConnection.onicecandidate = (event) => { this.handleOnIceCandidate(event) }

        this.rtcSendChannel = this.rtcConnection.createDataChannel('sendDataChannel', null);
    }

    public processServerMessage(signal: ServerMessage) {
        switch (signal.type) {
            case ServerMessageType.HI:
                this.createOffer();
            break;
            case ServerMessageType.ICE:
                this.addIceCandidate(signal.body)
            break;
            case ServerMessageType.SDP:
                this.setRemoteDescription(signal.body);
            break;
        }
    }

    private createOffer() {
        let peer = this;

        this.rtcConnection
            .createOffer()
            .then(function (description) {
                peer.setLocalDescription(description);
            })
            .catch(this.handleError);
    }

    private setRemoteDescription(details: any) {
        let peer = this;

        this.rtcConnection
        .setRemoteDescription(new RTCSessionDescription(details))
        .then(function () {
            // Only create answers in response to offers
            if (details.type == 'offer') {
                peer.rtcConnection
                    .createAnswer()
                    .then(function (description) {
                        peer.setLocalDescription(description);
                    })
                    .catch(peer.handleError);
            }
        }).catch(this.handleError);
    }

    private setLocalDescription(details: RTCSessionDescriptionInit) {
        let peer = this;

        this.rtcConnection
            .setLocalDescription(details)
            .then(function () {
                peer.eventDescription(peer.rtcConnection.localDescription);
            })
            .catch(this.handleError);
    }

    private addIceCandidate(details: RTCIceCandidate) {
        this.rtcConnection
            .addIceCandidate(new RTCIceCandidate(details))
            .catch(this.handleError);
    }

    private handleOnIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate != null) {
            this.eventIceCandidate(event.candidate);
        }
    }

    private handleOnDataChannel(event: RTCDataChannelEvent) {
        this.rtcReceiveChannel = event.channel;

        this.rtcReceiveChannel.onmessage = (event) => { this.handleReceiveChannelOnMessage(event) };
        this.rtcReceiveChannel.onopen = () => { this.handleReceiveChannelOnOpen() };
        this.rtcReceiveChannel.onclose = () => { this.handleReceiveChannelOnClose() };
    }

    private handleReceiveChannelOnMessage(event: MessageEvent) {
        this.eventOnMessage(event);
    }

    private handleReceiveChannelOnOpen() {
        var readyState = this.rtcReceiveChannel.readyState;
    }

    private handleReceiveChannelOnClose() {
        var readyState = this.rtcSendChannel.readyState;
    }

    private handleError() {

    }

    public messagePeer(message: string) {
        if(this.rtcSendChannel.readyState == 'open') {
            this.rtcSendChannel.send(message);
        }
    }
}