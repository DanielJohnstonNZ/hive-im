import {Message, MessageType, State, Peer} from "../models"
import {ActionTypeKeys, IActions} from "../actions"

export function appReducer(state: State = new State(), action: IActions) : State {
    switch (action.type) {
        case ActionTypeKeys.RECEIVE_MESSAGE:
            console.log(action);
            action.message.timestamp = new Date;

            return {...state, messages: [...state.messages, action.message]};
        case ActionTypeKeys.SEND_MESSAGE:
            action.message.source = state.local;
            action.message.timestamp = new Date;

            return {...state, messages: [...state.messages, action.message]};
        case ActionTypeKeys.PEER_CONNECTED:
            return {...state, peers: [...state.peers, action.peer]};
        case ActionTypeKeys.PEER_DISCONNECTED:
            return {...state, peers: state.peers.filter((peer: Peer) => peer.id != action.peer.id)}
        case ActionTypeKeys.PEER_UPDATED:
            return {...state, 
                peers: state.peers.map((existing: Peer) => existing.id == action.peer.id ? action.peer : existing)}
        case ActionTypeKeys.INFO_UPDATED:
            return {...state, local: action.peer}
        
    }
    return state;
}