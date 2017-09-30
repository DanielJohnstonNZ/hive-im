import { PeerConnection } from "../models/peerConnection";


export class PeerService {
    private activePeers: PeerConnection[];

    public eventOnPeerIceCandidate: (details: RTCIceCandidate, uuid: string) => void;
    public eventOnPeerDescription: (details: RTCSessionDescription, uuid: string) => void;

    constructor() {
        this.activePeers = [];
    }

    public getById(id: string) {
        if (!this.activePeers[id]) {
            let pc: PeerConnection = new PeerConnection(id);
            
            pc.eventIceCandidate = (candidate) => this.eventOnPeerIceCandidate(candidate, id);
            pc.eventDescription = (description) => this.eventOnPeerDescription(description, id);
            pc.eventOnMessage = (message) => {console.log(id + " says " + message.data)};
            
            this.activePeers[id] = pc;
        }
    
        return this.activePeers[id];
    }

    public messageAll(message: any) {
        for(var i in this.activePeers) {
            this.activePeers[i].messagePeer(message);
        }
    }
}