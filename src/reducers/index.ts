import {Message, MessageType, State, Peer} from "../models"
import {ActionTypeKeys, IActions} from "../actions"

export function appReducer(state: State = new State(), action: IActions) : State {
    switch (action.type) {
        case ActionTypeKeys.RECEIVE_MESSAGE:
            action.message.timestamp = new Date;

            return {...state, messages: [...state.messages, action.message]};
        case ActionTypeKeys.SEND_MESSAGE:
            action.message.source = state.uuid;
            action.message.timestamp = new Date;

            return {...state, messages: [...state.messages, action.message]};
        case ActionTypeKeys.PEER_CONNECTED:
            return {...state, peers: [...state.peers, action.peer]};
        case ActionTypeKeys.PEER_DISCONNECTED:
            return {...state, peers: state.peers.filter((peer: Peer) => peer.id != action.peer.id)}
        case ActionTypeKeys.INFO_UPDATED:
            return {...state, uuid: action.info.uuid}
        
    }
    return state;
}