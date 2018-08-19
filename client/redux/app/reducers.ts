import { IActions, AppState, Message, MessageType, Peer } from ".";

export function appReducer(
  state: AppState = new AppState(),
  action: IActions
): AppState {
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      action.message.timestamp = new Date();

      return { ...state, messages: [...state.messages, action.message] };
    case "SEND_MESSAGE":
      action.message.source = state.local;
      action.message.timestamp = new Date();

      return { ...state, messages: [...state.messages, action.message] };
    case "PEER_CONNECTED":
      return { ...state, peers: [...state.peers, action.peer] };
    case "PEER_DISCONNECTED":
      return {
        ...state,
        peers: state.peers.filter((peer: Peer) => peer.id != action.peer.id)
      };
    case "PEER_UPDATED":
      return {
        ...state,
        peers: state.peers.map(
          (existing: Peer) =>
            existing.id == action.peer.id ? action.peer : existing
        )
      };
    case "INFO_UPDATED":
      return { ...state, local: action.peer };
  }
  return state;
}
