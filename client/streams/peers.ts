import {Subject,Observable} from "rxjs"
import {Message,MessageType,Peer, MetaData} from "../models";
import {PeerFactory} from "../middleware/peerFactory"

var peerManager = new PeerFactory();

export const PeerMessageStreamOutput = new Subject<Message>();
peerManager.onMessage = (message: Message) => {
    PeerMessageStreamOutput.next(message);
}

export const PeerMessageStreamInput = new Subject<Message>();
PeerMessageStreamInput.subscribe({
    next: (message) => peerManager.messagePeer(message)
})

export const PeerMetaStreamOutput = new Subject<MetaData>();
peerManager.onMetaDataOut = (data: MetaData) => {
    PeerMetaStreamOutput.next(data);
}

export const PeerMetaStreamInput = new Subject<MetaData>();
PeerMetaStreamInput.subscribe({
    next: (data: MetaData) => peerManager.metaDataInput(data)
});

// Handle new connection.
export const PeerListStreamInput = new Subject<Peer>();
peerManager.onConnection = (peerId: string) => {
    let peer = new Peer();
    peer.id = peerId;
    PeerListStreamInput.next(peer);
    //let state: any = getState();
    //let localInfo: Peer = state.local;
    //let infoMsg: Message = new Message;

    //infoMsg.body = localInfo;
    //infoMsg.type = MessageType.INFO;

    // ps.getConnection(peer)
    //     .messagePeer(infoMsg);
}

