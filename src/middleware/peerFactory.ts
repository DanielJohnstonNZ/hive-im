import {PeerConnection} from "./peerConnection"
import {Message, MessageType} from "../models"

export class PeerFactory {
    private activePeers: { [id: string]: PeerConnection; };

    public onMessage: (message: Message) => void;
    public onConnection: (id: string) => void;

    constructor() {
        this.activePeers = {};
    }

    public getById(id: string) {
        if (!this.activePeers[id]) {
            let pc: PeerConnection = new PeerConnection();

            pc.onIceCandidate = (candidate: RTCIceCandidate) => {
                let message: Message = new Message;
                message.body = candidate;
                message.destination = id;
                message.type = MessageType.ICE;

                this.onMessage(message);
            }

            pc.onLocalDescription = (description: RTCSessionDescription) => {
                let message: Message = new Message;
                message.body = description;
                message.destination = id;
                message.type = MessageType.SDP;

                this.onMessage(message);
            }

            pc.onConnected = () => {
                this.onConnection(id);
            }

            pc.onDataMessage = (message: Message) => {
                message.source = id;
                message.type = MessageType.TEXT;

                this.onMessage(message);
            }

            this.activePeers[id] = pc;
        }

        return this.activePeers[id];
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