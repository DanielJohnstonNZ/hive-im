import {ServerMessage, ServerMessageType, State, Peer} from "../models"
import {ActionTypes} from "../actions"

export function appReducer(state: State = new State(), action: any) : State {
    switch (action.type) {
        case ActionTypes.PEER_RECEIVE_MESSAGE:
            action.message.timestamp = new Date;

            return {...state, messages: [...state.messages, action.message]};
        case ActionTypes.PEER_SEND_MESSAGE:
            action.message.source = state.uuid;
            action.message.timestamp = new Date;

            return {...state, messages: [...state.messages, action.message]};
        case ActionTypes.SERVER_RECEIVE_MESSAGE:
            // If we are receiving a message but we don't know our UUID yet, update that.
            if (!state.uuid) {
                return {...state, uuid: action.message.destination}
            }
            return state;
        case ActionTypes.PEER_CONNECTED:
            return {...state, peers: [...state.peers, action.peer]};
        case ActionTypes.PEER_DISCONNECTED:
            return {...state, peers: state.peers.filter((peer: Peer) => peer.id != action.peer.id)}
        
    }
    return state;
}