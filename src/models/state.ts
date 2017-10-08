import {Message, Peer} from ".";

export class State {
    messages: Message[];
    uuid: string;
    peers: Peer[];

    constructor() {
        this.messages = [];
        this.peers = [];
    }
};