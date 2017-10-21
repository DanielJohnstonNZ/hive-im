import {PeerConnection} from "./peerConnection"
import {Message, MessageType, Peer} from "../models"

export class PeerFactory {
    private activePeers: { [id: string]: PeerConnection; };

    public onMessage: (message: Message) => void;
    public onConnection: (id: Peer) => void;

    constructor() {
        this.activePeers = {};
    }

    public getConnection(peer: Peer) {
        if (!this.activePeers[peer.id]) {
            let pc: PeerConnection = new PeerConnection();

            pc.onIceCandidate = (candidate: RTCIceCandidate) => {
                let message: Message = new Message;
                message.body = candidate;
                message.destination = peer.id;
                message.type = MessageType.ICE;

                this.onMessage(message);
            }

            pc.onLocalDescription = (description: RTCSessionDescription) => {
                let message: Message = new Message;
                message.body = description;
                message.destination = peer.id;
                message.type = MessageType.SDP;

                this.onMessage(message);
            }

            pc.onConnected = () => {
                this.onConnection(peer);
            }

            pc.onDataMessage = (message: Message) => {
                message.source = peer;

                this.onMessage(message);
            }

            this.activePeers[peer.id] = pc;
        }

        return this.activePeers[peer.id];
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