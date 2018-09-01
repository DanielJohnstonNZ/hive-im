export class Peer {
  id: string;
  connected: boolean;
}

export class PeerState {
  peers: Peer[] = [];
}
