import {PeerMessage, Peer} from ".";

export class State {
    messages: PeerMessage[];
    uuid: string;
    peers: Peer[];

    constructor() {
        this.messages = [];
        this.peers = [];
    }
};