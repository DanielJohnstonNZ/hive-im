import { ServerMessageType } from "../models";
import {PeerFactory} from "./peerFactory"

import { ActionTypes, serverReceiveMessage, peerDisconnected } from "../actions"
import { Middleware, Dispatch, MiddlewareAPI } from "redux"

export const PeerMiddleware: Middleware = <S>({ getState, dispatch }: MiddlewareAPI<S>) => {
    let ps: PeerFactory = new PeerFactory(dispatch);

    let connection: WebSocket = new WebSocket(location.origin.replace(/^http/, 'ws'));
    connection.onmessage = (event: MessageEvent) => { dispatch(serverReceiveMessage(event.data)) };

    return (next: Dispatch<S>) =>
        (action: any): any => {
            switch (action.type) {
                case ActionTypes.SERVER_SEND_MESSAGE: 
                    connection.send(action.message);
                    break;
                case ActionTypes.SERVER_RECEIVE_MESSAGE:
                    switch (action.message.type) {
                        case ServerMessageType.HI:
                            ps.getById(action.message.source)
                                .createOffer();
                            break;
                        case ServerMessageType.ICE:
                            ps.getById(action.message.source)
                                .addIceCandidate(action.message.body);
                            break;
                        case ServerMessageType.SDP:
                            ps.getById(action.message.source)
                                .addRemoteDescription(action.message.body);
                            break;
                        case ServerMessageType.BYE:
                            dispatch(peerDisconnected(action.message.source))
                    }

                    return next(action)
                case ActionTypes.PEER_SEND_MESSAGE:
                    ps.messageAll(action.message.body);

                    return next(action);
                default:
                    return next(action);
            }
        }
}