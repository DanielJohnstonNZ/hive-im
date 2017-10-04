import {PeerMessage} from "./peerMessage";

export class State {
    messages: PeerMessage[];
    uuid: string;

    constructor() {
        this.messages = [];
    }
};