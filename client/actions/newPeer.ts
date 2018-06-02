import {ServerStreamOutput, ServerStreamInput}  from "../streams/server"
import {PeerMessageStreamOutput, PeerMessageStreamInput, PeerMetaStreamOutput, PeerMetaStreamInput, PeerListStreamInput}  from "../streams/peers"
import {Observable} from "rxjs"
import {filter} from "rxjs/operators"
import {Message,MessageType, MetaData,Peer} from "../models"
import * as Actions from "./index"

import {Dispatch} from "redux"

export namespace NewPeer {

    let t = ServerStreamOutput
        .subscribe({
            next: (data: MetaData) => PeerMetaStreamInput.next(data)
        });
    
    let s = PeerMetaStreamOutput
        .subscribe({
            next: (data : MetaData) => ServerStreamInput.next(data)
        });

    // let u = PeerListStreamInput
    //     .subscribe({
    //         next: (peer: Peer) =>  dispatch(Actions.peerConnected(peer))
    //     });

//     PeerStream.subscribe({
//     next: function(message: Models.Message) {
//         switch(message.type) {
//             case Models.MessageType.TEXT:
//                 //dispatch(Actions.receiveTextMessage(message));
//                 break;
//             case Models.MessageType.INFO:
//                 //dispatch(Actions.peerUpdated(message.body));
//                 break;
//         }
//     }
// })

// var peerManager = new PeerFactory();
// peerManager.onMessage = (message: Message) => {
//     PeerStream.next(message);

//     switch(message.type) {
//         case MessageType.TEXT:
//             //dispatch(Actions.receiveTextMessage(message));
//             break;
//         case MessageType.INFO:
//             //dispatch(Actions.peerUpdated(message.body));
//             break;
//     }
// }
// ServerSteams.incoming.subscribe({
//     next: function(message) {
//         switch (message.type) {
//             case MessageType.INFO:
//                 console.log(message.body);
//                 //dispatch(Actions.infoUpdated(message.body));
//                 //break;
//         }
//     }
// });
}