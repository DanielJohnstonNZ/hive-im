import { IActions, PeerState } from ".";

export function reducer(
  state: PeerState = new PeerState(),
  action: IActions
): PeerState {
  switch (action.type) {
    case "peer/CONNECTED":
      state = {
        ...state,
        peers: [...state.peers, action.id]
      };
  }
  return state;
}
