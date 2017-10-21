import {Message, Peer} from ".";

export class State {
    messages: Message[];
    local: Peer; // Stores peer info about me.
    peers: Peer[];

    constructor() {
        this.messages = [];
        this.peers = [];
    }
};