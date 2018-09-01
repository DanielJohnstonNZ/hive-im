class PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel;

  constructor(id: string) {
    this.id = id;
    this.connection = new RTCPeerConnection(null);
    this.dataChannel = this.connection.createDataChannel(
      "sendDataChannel",
      null
    );
  }
}

class Factory {
  private peers: PeerConnection[] = [];

  public connection(id: string): RTCPeerConnection {
    if (!this.peers.some(c => c.id === id)) {
      this.peers.push(new PeerConnection(id));
    }

    return this.peers.filter(c => c.id === id)[0].connection;
  }

  public exists(id: string) {
    return this.peers.some(c => c.id === id);
  }

  public sendChannels(): RTCDataChannel[] {
    return this.peers
      .map(r => r.dataChannel)
      .filter(c => c.readyState == "open");
  }
}

export const Peers = new Factory();
