import {PeerConnection} from "./peerConnection"

export class PeerFactory {
    private activePeers: { [id: string]: PeerConnection; };

    private dispatch: any;

    constructor(dispatch: any) {
        this.activePeers = {};

        this.dispatch = dispatch
    }

    public getById(id: string) {
        if (!this.activePeers[id]) {
            let pc: PeerConnection = new PeerConnection(id, this.dispatch);

            this.activePeers[id] = pc;
        }

        return this.activePeers[id];
    }

    public messageAll(message: string) {
        for (var i in this.activePeers) {
            this.activePeers[i].messagePeer(message);
        }
    }

    private handleOnClose(id: string) {
        delete this.activePeers[id];
    }
}