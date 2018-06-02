// import { MessageType, Message, Peer } from "../models";
// import {PeerFactory} from "./peerFactory"

// import * as Actions from "../actions"
// import { Middleware, Dispatch, MiddlewareAPI } from "redux"

// export const PeerMiddleware: Middleware = <S>({dispatch, getState }: MiddlewareAPI<S>) => {
//     let ps: PeerFactory = new PeerFactory();
//     let connection: WebSocket = new WebSocket(location.origin.replace(/^http/, 'ws'));

//     // Handle incoming/outgoing messages from Peers
//     ps.onMessage = (message: Message) => {
//         switch(message.type) {
//             case MessageType.SDP:
//             case MessageType.ICE:
//                 connection.send(JSON.stringify(message));
//                 break;
//             case MessageType.TEXT:
//                 dispatch(Actions.receiveTextMessage(message));
//                 break;
//             case MessageType.INFO:
//                 dispatch(Actions.peerUpdated(message.body));
//                 break;
//         }
//     }

//     // Handle new connection.
//     ps.onConnection = (peer: Peer) => {
//         let state: any = getState();
//         let localInfo: Peer = state.local;
//         let infoMsg: Message = new Message;

//         infoMsg.body = localInfo;
//         infoMsg.type = MessageType.INFO;

//         ps.getConnection(peer)
//             .messagePeer(infoMsg);

//         dispatch(Actions.peerConnected(peer));
//     }

//     // Handle a new message on the websocket connection.
//     connection.onmessage = (event: MessageEvent) => { 
//         let message: Message = JSON.parse(event.data);
//         switch (message.type) {
//             case MessageType.HI:
//                 ps.getConnection(message.source)
//                     .createOffer();

                
//                 break;
//             case MessageType.SDP:
//                 ps.getConnection(message.source)
//                     .addRemoteDescription(message.body);
//                 break;
//             case MessageType.ICE:
//                 ps.getConnection(message.source)
//                     .addIceCandidate(message.body);
//                 break;
//             case MessageType.BYE:
//                 dispatch(Actions.peerDisconnected(message.source.id));
//                 break;
//             case MessageType.INFO:
//                 dispatch(Actions.infoUpdated(message.body));
//                 break;
//         }
//     };

//     return (next: Dispatch<S>) =>
//         (action: any): any => {
//             switch (action.type) {
//                 case Actions.ActionTypeKeys.SEND_MESSAGE:
//                     ps.messageAll(action.message);

//                     return next(action);
//                 default:
//                     return next(action);
//             }
//         }
// }