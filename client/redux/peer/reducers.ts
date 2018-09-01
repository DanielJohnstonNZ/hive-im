import { IActions, PeerState } from ".";
import { Peer } from "./types";

export function reducer(
  state: PeerState = new PeerState(),
  action: IActions
): PeerState {
  switch (action.type) {
    case "peer/CONNECTING":
      state = {
        ...state,
        peers: [...state.peers, { id: action.id, connected: false }]
      };
      break;
    case "peer/CONNECTED":
      const index = state.peers.findIndex(p => p.id === action.id);

      state = {
        ...state,
        peers: [
          ...state.peers.slice(0, index),
          {
            ...state.peers[index],
            connected: true
          },
          ...state.peers.slice(index + 1)
        ]
      };
  }
  return state;
}
