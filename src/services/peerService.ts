import { PeerConnection } from "../models/peerConnection";
import { PeerMessage } from "../models/peerMessage";

export class PeerService {
    private activePeers: {[id: string] : PeerConnection; };

    public eventOnPeerIceCandidate: (details: RTCIceCandidate, uuid: string) => void;
    public eventOnPeerDescription: (details: RTCSessionDescription, uuid: string) => void;
    public eventOnPeerMessage: (message: PeerMessage) => void;

    constructor() {
        this.activePeers = {};
    }

    public getById(id: string) {
        if (!this.activePeers[id]) {
            let pc: PeerConnection = new PeerConnection(id);
            
            pc.eventIceCandidate = (candidate) =>{ this.eventOnPeerIceCandidate(candidate, id); }
            pc.eventDescription = (description) => this.eventOnPeerDescription(description, id);
            pc.eventOnMessage = (message) => this.eventOnPeerMessage(message);
            pc.eventOnClose = () => this.handleOnClose(id);
            
            this.activePeers[id] = pc;
        }
    
        return this.activePeers[id];
    }

    public getCount() {
        return Object.keys(this.activePeers).length;
    }

    public messageAll(message: string) {
        for(var i in this.activePeers) {
            this.activePeers[i].messagePeer(message);
        }
    }

    private handleOnClose(id: string) {
        delete this.activePeers[id];
    }

}